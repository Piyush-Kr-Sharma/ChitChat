import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/login");
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error("Please select an image", toastOptions);
      return;
    }

    const user = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );

    const formData = new FormData();
    formData.append("avatar", selectedImage);

    try {
      const { data } = await axios.post(
        `${setAvatarRoute}/${user._id}`,
        formData
      );

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Failed to set avatar", toastOptions);
      }
    } catch (err) {
      toast.error("Upload failed", toastOptions);
    }
  };

  return (
    <Container>
      <div className="title-container">
        <h1>Upload your profile picture</h1>
      </div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {previewImage && (
        <div className="avatar-preview">
          <img src={previewImage} alt="Avatar Preview" />
        </div>
      )}
      <button onClick={handleSubmit} className="submit-btn">
        Set as Profile Picture
      </button>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 2rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .title-container h1 {
    color: white;
  }

  input[type="file"] {
    color: white;
  }

  .avatar-preview img {
    height: 150px;
    width: 150px;
    border-radius: 50%;
    border: 3px solid #4e0eff;
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #3b0ccf;
    }
  }
`;
