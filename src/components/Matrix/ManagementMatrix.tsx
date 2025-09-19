import React from "react";
import { Card, Select } from "antd";

const { Option } = Select;

export default function CareerPathMatrix() {
  const positions = [
    "Quản lý bảo dưỡng",
    "Phó phòng Quản lý thay đổi",
    "Trưởng phòng Quản lý thay đổi",
    "Kỹ sư Quản lý thay đổi hệ thống mạng lõi",
    "Kỹ sư Quản lý thay đổi hệ thống mạng truy nhập",
    "Kỹ sư Quản lý thay đổi thị trường",
  ];

  const levels = ["Bậc 11","Bậc 12","Bậc 13","Bậc 14","Bậc 15","Bậc 16","Bậc 17"];

  // Example data matrix
  const matrix = {
    "Quản lý bảo dưỡng": { 11: "PvM0/1", 12: "PvM2" },
    "Phó phòng Quản lý thay đổi": { 14: "PP" },
    "Trưởng phòng Quản lý thay đổi": { 15: "TP" },
    "Kỹ sư Quản lý thay đổi hệ thống mạng lõi": { 11: "CM0/1", 12: "CM2", 14: "CM3" },
    "Kỹ sư Quản lý thay đổi hệ thống mạng truy nhập": { 11: "CM0/1", 12: "CM2", 14: "CM3" },
    "Kỹ sư Quản lý thay đổi thị trường": { 11: "CM0/1", 12: "CM2", 14: "CM3" },
  };

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <Select placeholder="Ngành" style={{ width: 200 }}>
          <Option value="impact">Quản lý tác động</Option>
          <Option value="other">Ngành khác</Option>
        </Select>

        <Select placeholder="Nghề" style={{ width: 200 }}>
          <Option value="operation">Vận hành khai thác</Option>
          <Option value="other">Khác</Option>
        </Select>
      </div>

      {/* Matrix */}
      <Card className="overflow-auto">
        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-blue-500 text-white p-2 text-left">Vị trí</th>
                {levels.map((lvl) => (
                  <th key={lvl} className="bg-blue-500 text-white p-2">{lvl}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions.map((pos) => (
                <tr key={pos} className="border-b">
                  <td className="bg-blue-100 p-2 font-medium">{pos}</td>
                  {levels.map((lvl, i) => {
                    const cell = matrix[pos]?.[parseInt(lvl.split(" ")[1])] || "";
                    const isCurrent = cell === "CM0/1"; // Example: highlight current level
                    return (
                      <td
                        key={i}
                        className={`text-center p-2 border 
                          ${isCurrent ? "bg-blue-600 text-white font-bold rounded" : "bg-green-100"}
                        `}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
