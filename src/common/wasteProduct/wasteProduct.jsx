import React, { useState, useEffect } from "react";
import axios from 'axios'; // Import Axios
import './wasteProduct.css';

function WasteProduct() {
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [yourAuthToken, setYourAuthToken] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImageURL(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUpload = async () => {
        if (!image) {
            alert('Please select an image first.');
            return;
        }

        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'um1ovdoq');

        try {
            setUploadingImage(true);
            const response = await axios.post('https://api.cloudinary.com/v1_1/ddjyjlqcy/image/upload', data);

            if (response.status === 200) {
                const responseData = response.data;
                setImageURL(responseData.url);
                alert('Image uploaded successfully');
            } else {
                alert('Image upload failed');
            }
        } catch (error) {
            console.error('error uploading:', error);
        } finally {
            setUploadingImage(false);
        }
    };

    useEffect(() => {
        if (imageURL) {
            console.log(imageURL);
        }
    }, [imageURL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!yourAuthToken) {
            alert('Token not available. Please retrieve the token first.');
            return;
        }
    
        if (!imageURL) {
            alert('Please upload an image first.');
            return;
        }
    
        try {
            const response = await axios.post(
                'http://localhost:8080/api/waste/disposed',
                {
                    imageLink: imageURL, // Send imageURL as a string
                    quantity,
                    description,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${yourAuthToken}`,
                        'Content-Type': 'application/json', // Set the content type for JSON data
                    },
                }
            );
    
            if (response.status === 201) {
                console.log(response.data);
                alert('Product uploaded successfully');
            } else {
                const responseData = response.data;
                console.error('Error response from the server:', responseData);
                if (responseData.message === 'All fields are mandatory') {
                    if (!imageURL) {
                        console.error('Image link is missing in the request.');
                    }
                    if (!quantity) {
                        console.error('Quantity is missing in the request.');
                    }
                    if (!description) {
                        console.error('Description is missing in the request.');
                    }
                }
                alert(`Product upload failed: ${responseData.message}`);
            }
        } catch (error) {
            console.error('Error uploading product:', error);
            alert('An error occurred while uploading the product.');
        }
    };
    
    
    useEffect(() => {
        // Retrieve the token from your custom route
        axios.get('http://localhost:8080/api/user/retrieve-token')
            .then(response => {
                const token = response.data.token;
                setYourAuthToken(token);
            })
            .catch(error => console.error('Error fetching token:', error));
    }, []);

    return (
        <div className="product-upload">
            <div className="add-details">
                <form onSubmit={handleSubmit}>
                    <h2>Upload Your Product</h2>
                    <div className="form-group">
                        <label htmlFor="image">Choose Image:</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageSelect}
                        />
                    </div>
                    <div className="form-group">
                        <label>Preview:</label>
                        {previewImage && (
                            <img src={previewImage} alt="Product Preview" />
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={uploadingImage}
                    >
                        {uploadingImage ? 'Uploading...' : 'Upload Image to Cloudinary'}
                    </button>
                    {uploadingImage && (
                        <p>Uploading image...</p>
                    )}
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" disabled={uploadingImage}>
                        Upload Product
                    </button>
                </form>
            </div>
        </div>
    );
}

export default WasteProduct;
