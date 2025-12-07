import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaEdit, FaTrashAlt } from 'react-icons/fa';

// ----------------------------------------------------
// 🎯 LOCAL STORAGE KEY AND HELPERS
// ----------------------------------------------------
const STORAGE_KEY = 'touristaPackages';

const initialPackages = [
    { id: 1001, title: "Hunza Valley Explorer", originalPrice: 28000, discountedPrice: 24500, days: 5, image: null },
    { id: 1002, title: "Fairy Meadows Trek", originalPrice: 35000, discountedPrice: 29999, days: 7, image: null },
    { id: 1003, title: "Skardu Serenity", originalPrice: 40000, discountedPrice: 36000, days: 6, image: null },
    { id: 1004, title: "Naran Kaghan Bliss", originalPrice: 22000, discountedPrice: 19500, days: 4, image: null },
];

const savePackagesToLS = (packages) => {
    // Note: We remove the 'image' File object before saving, as Local Storage only handles strings.
    const serializablePackages = packages.map(pkg => ({ ...pkg, image: null })); 
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializablePackages));
};

const loadPackagesFromLS = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    }
    // Initialize if nothing is found, and save the defaults
    savePackagesToLS(initialPackages);
    return initialPackages;
};
// ----------------------------------------------------


const AdminDiscountPackages = () => {
    // 🛑 1. Use loaded data from Local Storage as initial state
    const [packages, setPackages] = useState(loadPackagesFromLS);
    
    const [isEditing, setIsEditing] = useState(false);
    const [currentPackage, setCurrentPackage] = useState(null);
    
    const maxId = packages.reduce((max, pkg) => Math.max(max, pkg.id), 1000);
    const [nextId, setNextId] = useState(maxId + 1);

    const [title, setTitle] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState('');
    const [days, setDays] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [image, setImage] = useState(null);

    // 🛑 2. Sync state changes to Local Storage whenever 'packages' changes
    useEffect(() => {
        savePackagesToLS(packages);
    }, [packages]);

    const resetForm = () => {
        setTitle('');
        setOriginalPrice('');
        setDiscountedPrice('');
        setDays('');
        setDiscountPercent('');
        setImage(null);
        setIsEditing(false);
        setCurrentPackage(null);
    };

    const handleOriginalPriceChange = (e) => {
        const price = Number(e.target.value);
        setOriginalPrice(price);
        if (discountPercent >= 0) setDiscountedPrice(price * (1 - discountPercent / 100));
        else setDiscountedPrice(price);
    };

    const handleDiscountPercentChange = (e) => {
        const percent = Number(e.target.value);
        setDiscountPercent(percent);
        if (originalPrice > 0) setDiscountedPrice(originalPrice * (1 - percent / 100));
        else setDiscountedPrice(0);
    };

    const handleImageChange = (e) => {
        // Image object is stored in state but won't be saved to LS.
        if (e.target.files && e.target.files[0]) setImage(e.target.files[0]);
    };

    // 🛑 3. Submission updates state, triggering useEffect to save to LS
    const handleSubmit = (e) => {
        e.preventDefault();

        const newPackage = {
            id: isEditing ? currentPackage.id : nextId,
            title,
            originalPrice: Number(originalPrice),
            discountedPrice: Math.round(Number(discountedPrice)),
            days: Number(days),
            image: image,
        };

        if (isEditing) {
            setPackages(packages.map(pkg => pkg.id === newPackage.id ? newPackage : pkg));
        } else {
            setPackages([...packages, newPackage]);
            setNextId(prevId => prevId + 1);
        }

        resetForm();
    };

    const handleEdit = (pkg) => {
        setCurrentPackage(pkg);
        setIsEditing(true);
        setTitle(pkg.title);
        setOriginalPrice(pkg.originalPrice);
        setDiscountedPrice(pkg.discountedPrice);
        setDays(pkg.days);
        setImage(pkg.image || null);
        const calculatedDiscount = Math.round((1 - (pkg.discountedPrice / pkg.originalPrice)) * 100);
        setDiscountPercent(isNaN(calculatedDiscount) ? 0 : calculatedDiscount);
    };

    // 🛑 4. Deletion updates state, triggering useEffect to save to LS
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this package? This cannot be undone.")) {
            setPackages(packages.filter(pkg => pkg.id !== id));
            if (isEditing && currentPackage.id === id) resetForm();
        }
    };

    const getDiscountPercentage = (original, discounted) => {
        if (!original || original === 0) return 0;
        return Math.round((1 - discounted / original) * 100);
    };

    return (
        <div className="packages-manager">
            <h1 className="admin-page-title">
                {isEditing ? `Edit Package: ${currentPackage?.title}` : "Manage Discounted Packages"}
            </h1>

            <div className="admin-card-form">
                <h2 className="card-form-title">
                    <FaPlusCircle /> {isEditing ? "Edit Package Details" : "Create New Package"}
                </h2>

                <form onSubmit={handleSubmit} className="package-form-grid">
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
                    <input type="number" placeholder="Duration (Days)" value={days} onChange={e => setDays(e.target.value)} required min="1" />
                    <input type="number" placeholder="Original Price" value={originalPrice} onChange={handleOriginalPriceChange} required min="1000" />

                    <div className="form-group-flex">
                        <input type="number" placeholder="Discount %" value={discountPercent} onChange={handleDiscountPercentChange} min="0" max="99" style={{ width: '60%' }} />
                        <span className="discount-price-display">
                            Final Price: PKR {Math.round(discountedPrice)}
                        </span>
                    </div>

                    {/* --- Image Upload --- */}
                    <input type="file" accept="image/*" onChange={handleImageChange} />

                    {image && (
                        <div style={{ marginTop: '10px' }}>
                            <strong>Preview:</strong>
                            <br />
                            <img src={URL.createObjectURL(image)} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px', marginTop: '5px' }} />
                        </div>
                    )}

                    <div className="form-action-buttons">
                        {isEditing && <button type="button" className="admin-btn-cancel" onClick={resetForm}>Cancel Edit</button>}
                        <button type="submit" className="admin-btn-submit">{isEditing ? "Save Changes" : "Create Package"}</button>
                    </div>
                </form>
            </div>

            <h2 className="admin-list-title">Existing Packages ({packages.length})</h2>
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Days</th>
                            <th>Original Price</th>
                            <th>Discount %</th>
                            <th>Final Price</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packages.map(pkg => (
                            <tr key={pkg.id}>
                                <td>{pkg.id}</td>
                                <td>{pkg.title}</td>
                                <td>PKR {pkg.originalPrice}</td>
                                <td>
                                    {getDiscountPercentage(pkg.originalPrice, pkg.discountedPrice)}%
                                </td>
                                <td>PKR {Math.round(pkg.discountedPrice)}</td>
                                <td>
                                    {pkg.image ? (
                                        <img src={URL.createObjectURL(pkg.image)} alt="Package" style={{ maxWidth: '80px', borderRadius: '6px' }} />
                                    ) : 'No Image'}
                                </td>
                                <td className="action-cell">
                                    <button className="icon-btn edit-btn" onClick={() => handleEdit(pkg)}><FaEdit /></button>
                                    <button className="icon-btn delete-btn" onClick={() => handleDelete(pkg.id)}><FaTrashAlt /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default AdminDiscountPackages;