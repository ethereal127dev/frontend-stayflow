// File: src/pages/ReviewsAdmin.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const ReviewsAdmin = ({ role }) => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState("all");
  const [loading, setLoading] = useState(true);

  const userRole = role || localStorage.getItem("role");

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        let url = "/reviews/admin"; // admin: ดูทั้งหมด
        if (userRole === "owner" || userRole === "staff") {
          url = "/reviews/property"; // owner/staff: ดูเฉพาะหอตัวเอง
        }

        const res = await API.get(url);
        const data = res.data;

        setReviews(data);
        setFilteredReviews(data);

        // ✅ ดึงชื่อ property ทั้งหมดโดยไม่ซ้ำ
        const uniqueProps = Array.from(
          new Map(
            data.map((r) => [r.property.id, { id: r.property.id, name: r.property.name }])
          ).values()
        );
        setProperties(uniqueProps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [userRole]);

  // ✅ เมื่อเลือกหอใน dropdown
  const handlePropertyChange = (e) => {
    const value = e.target.value;
    setSelectedProperty(value);

    if (value === "all") {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter(
        (r) => r.property.id.toString() === value
      );
      setFilteredReviews(filtered);
    }
  };

  return (
    <Layout role={userRole} showFooter={false} showNav={false}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-yellow-400 text-white shadow-lg pb-4 pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-kanit">
              รีวิวอสังหาริมทรัพย์
            </h1>
            <p className="text-yellow-100 text-sm">
              แสดงรีวิวของ{" "}
              {userRole === "admin"
                ? "ทุกอสังหาริมทรัพย์"
                : "อสังหาริมทรัพย์ของคุณ"}
            </p>
          </div>

          {/* ✅ แสดง select เฉพาะกรณีที่มีหลายหอ */}
          {properties.length > 1 && (
            <div className="mt-2 md:mt-0">
              <select
                value={selectedProperty}
                onChange={handlePropertyChange}
                className="px-3 py-2 rounded-lg bg-white text-gray-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
              >
                <option value="all">ดูทั้งหมด</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* เนื้อหารีวิว */}
      <div className="bg-yellow-50 p-4 md:p-6 max-h-[calc(103vh-120px)] overflow-y-auto">
        {loading ? (
          <p>กำลังโหลด...</p>
        ) : filteredReviews.length === 0 ? (
          <p>ยังไม่มีรีวิว</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((r) => (
              <div
                key={r.review.id}
                className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300"
              >
                {/* Property Header */}
                <div className="flex items-center mb-3">
                  <i className="fas fa-building text-indigo-500 text-xl mr-3"></i>
                  <h2 className="text-lg font-bold font-kanit text-gray-800">
                    {r.property.name}
                  </h2>
                </div>

                {/* User Info & Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        r.user_fullname || "คุณ"
                      )}&background=random&color=white`}
                      alt={r.user_fullname || "User"}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="font-medium text-gray-700">
                      {r.user_fullname || "คุณ"}
                    </span>
                  </div>
                  <div className="flex items-center ml-auto">
                    <span className="text-yellow-500 font-semibold mr-1">
                      {r.review.rating}
                    </span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${
                            i < Math.floor(r.review.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        ></i>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div className="mb-4 relative pl-4 border-l-4 border-indigo-100">
                  <i className="fas fa-quote-left text-indigo-200 absolute left-0 top-2 text-lg"></i>
                  <p className="text-gray-700 leading-relaxed">
                    {r.review.comment}
                  </p>
                </div>

                {/* Timestamp */}
                <div className="flex items-center text-sm text-gray-500">
                  <i className="far fa-calendar-alt mr-2"></i>
                  <span>สร้างเมื่อ: {formatDate(r.review.created_at)}</span>
                  {r.review.updated_at && (
                    <>
                      <span className="mx-2">|</span>
                      <i className="fas fa-sync-alt mr-2"></i>
                      <span>
                        แก้ไขล่าสุด: {formatDate(r.review.updated_at)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReviewsAdmin;
