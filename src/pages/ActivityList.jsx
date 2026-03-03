// src/pages/Activity.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import API from "../api";

const ActivityList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ฟังก์ชันสำหรับแปลงประเภทกิจกรรมเป็นข้อความภาษาไทย
  const getActivityText = (activity) => {
    const { action, user_fullname, description, target_type, target_id } =
      activity;

    // ถ้ามี description ให้ใช้ description ก่อน
    if (description) {
      return description;
    }

    // ถ้าไม่มี description ให้สร้างข้อความจาก action และ target_type, target_id
    switch (action) {
      case "booking":
        return `${user_fullname} จองห้อง (ID: ${target_id})`;
      case "cancel_booking":
        return `${user_fullname} ยกเลิกการจองห้อง (ID: ${target_id})`;
      case "create_property":
        return `${user_fullname} เพิ่มอสังหาริมทรัพย์ (ID: ${target_id})`;
      case "update_property":
        return `${user_fullname} แก้ไขข้อมูลอสังหาริมทรัพย์ (ID: ${target_id})`;
      case "delete_property":
        return `${user_fullname} ลบอสังหาริมทรัพย์ (ID: ${target_id})`;
      case "create_room":
        return `${user_fullname} เพิ่มห้อง (ID: ${target_id})`;
      case "update_room":
        return `${user_fullname} แก้ไขข้อมูลห้อง (ID: ${target_id})`;
      case "delete_room":
        return `${user_fullname} ลบห้อง (ID: ${target_id})`;
      case "create_user":
        return `${user_fullname} เพิ่มผู้ใช้ (ID: ${target_id})`;
      case "update_user":
        return `${user_fullname} แก้ไขข้อมูลผู้ใช้ (ID: ${target_id})`;
      case "delete_user":
        return `${user_fullname} ลบผู้ใช้ (ID: ${target_id})`;
      default:
        return `${user_fullname} ดำเนินการ ${action} (${target_type} ID: ${target_id})`;
    }
  };

  // ฟังก์ชันสำหรับเลือกไอคอนตามประเภทกิจกรรม
  const getActivityIcon = (action) => {
    switch (action) {
      case "booking":
        return "fas fa-calendar-plus text-blue-500";
      case "cancel_booking":
        return "fas fa-calendar-times text-red-500";
      case "create_property":
      case "create_room":
      case "create_user":
      case "add_tenant":
      case "create_maintenance":
        return "fas fa-plus-circle text-green-500";
      case "update_property":
      case "edit_property":
      case "update_room":
      case "update_user":
        return "fas fa-edit text-blue-500";
      case "delete_property":
      case "delete_room":
      case "delete_user":
        return "fas fa-trash-alt text-red-500";
      default:
        return "fas fa-info-circle text-gray-500";
    }
  };

  // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบไทย
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "เมื่อสักครู่";
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;

    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchActivities = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      const res = await API.get(`/activity?limit=20&page=${pageNum}`);

      if (reset) {
        setActivities(res.data);
      } else {
        setActivities((prev) => [...prev, ...res.data]);
      }

      // ตรวจสอบว่ายังมีข้อมูลอีกหรือไม่
      setHasMore(res.data.length === 20);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(1, true);
  }, []);

  // ตรวจจับการเลื่อนหน้าจอเพื่อโหลดข้อมูลเพิ่ม
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading ||
        !hasMore
      ) {
        return;
      }
      fetchActivities(page + 1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  return (
    <Layout role="admin" showFooter={false} showNav={false}>
      {/* Sticky Header with Gradient Background */}
      <div className="sticky top-0 z-10 bg-teal-400 text-white shadow-lg pb-4 pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold font-kanit mb-1">
              ประวัติการทำงาน
            </h1>
            <p className="text-indigo-100 text-sm">
              ติดตามการใช้งานทั้งหมดที่เกิดขึ้นในระบบ
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-h-[calc(100vh-120px)] overflow-y-auto bg-teal-50 p-4 md:p-6">
        {/* Loading State */}
        {loading && activities.length === 0 ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg shadow animate-pulse"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-history text-indigo-500 text-4xl"></i>
            </div>
            <h3 className="text-xl font-bold font-kanit mb-2">ไม่มีกิจกรรม</h3>
            <p className="text-gray-600 mb-6">
              ยังไม่มีกิจกรรมที่เกิดขึ้นในระบบ
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((act, index) => (
              <div
                key={act.id || index}
                className={`p-4 rounded-lg shadow transition-all duration-300 hover:shadow-md ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <i className={getActivityIcon(act.action)}></i>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-gray-800 font-medium">
                        {getActivityText(act)}
                      </p>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatDateTime(act.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <span>กิจกรรม ID: {act.id}</span>
                      {act.user_id && <span className="mx-2">•</span>}
                      {act.user_id && <span>ผู้ใช้ ID: {act.user_id}</span>}
                      {act.target_type && <span className="mx-2">•</span>}
                      {act.target_type && (
                        <span>ประเภท: {act.target_type}</span>
                      )}
                      {act.target_id && <span className="mx-2">•</span>}
                      {act.target_id && (
                        <span>เป้าหมาย ID: {act.target_id}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading more indicator */}
            {loading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && (
              <div className="text-center py-4 text-gray-500">
                ดูกิจกรรมทั้งหมดแล้ว
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ActivityList;
