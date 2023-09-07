import React, { useState, useEffect } from "react";
import './wasteProduct.css';

function WasteProduct() {
    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [description, setDescription] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [yourAuthToken, setYourAuthToken] = useState('');

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    async function uploadImage() {
        if (!image) {
            alert('Please select an image first.');
            return;
        }

        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'um1ovdoq');

        try {
            const response = await fetch('https://api.cloudinary.com/v1_1/ddjyjlqcy/image/upload', {
                method: 'POST',
                body: data,
            });

            if (response.ok) {
                const responseData = await response.json();
                setImageURL(responseData.url);
                alert('Image uploaded successfully');
            } else {
                alert('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    }

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

        const formData = new FormData();
        if (imageURL) {
            formData.append('imageLink', imageURL); // Use the imageURL if available
        }
        formData.append('quantity', quantity);
        formData.append('description', description);

        // Log the formData to check what is being sent
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        try {
            const response = await fetch('http://localhost:8080/api/waste/disposed', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${yourAuthToken}`,
                },
            });

            if (response.ok) {
                alert('Product uploaded successfully');
            } else {
                const responseData = await response.json();
                console.error('Error response from the server:', responseData);
                if (responseData.message === "All fields are mandatory") {
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
        fetch('http://localhost:8080/api/user/retrieve-token', {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => {
                const token = data.token;
                setYourAuthToken(token); // Store the retrieved token in state
            })
            .catch(error => console.error('Error fetching token:', error));
    }, []);

    return (
        <div className="product-upload">
            <div className="add-details">
                <form onSubmit={handleSubmit}>
                    <h2>Upload Your Product</h2>
                    <div className="form-group">
                        <label htmlFor="image">Upload Image:</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <button type="button" onClick={uploadImage}>Upload Image to Cloudinary</button>
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
                    <button type="submit">Upload Product</button>
                </form>
            </div>
            <div className="preview-details">
                <div className="preview">
                    <h2>Preview</h2>
                    {previewImage && (
                        <img src={previewImage} alt="Product Preview" />
                    )}
                    <div>
                        <label>Quantity:</label>
                        <input type="text" value={quantity} readOnly />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea value={description} readOnly />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WasteProduct;
