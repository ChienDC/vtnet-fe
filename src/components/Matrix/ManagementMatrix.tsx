import React, { useState, useEffect, useRef } from "react";
import { Card, Select, Button, Input, ColorPicker, Space, message, Modal } from "antd";
import { 
  SaveOutlined, 
  UndoOutlined, 
  RedoOutlined, 
  EditOutlined,
  ArrowRightOutlined,
  DeleteOutlined
} from '@ant-design/icons';

const { Option } = Select;

interface CellData {
  text: string;
  color: string;
  backgroundColor: string;
}

interface ArrowData {
  id: string;
  from: { row: number; col: number };
  to: { row: number; col: number };
  color: string;
}

// Simple Arrow Component - Just draw line between two points
const SVGArrow: React.FC<{
  from: { row: number; col: number };
  to: { row: number; col: number };
  color: string;
  cellSize: { width: number; height: number };
  offset: { x: number; y: number };
}> = ({ from, to, color, cellSize, offset }) => {
  // Calculate positions based on cell size
  const startX = (from.col + 1) * cellSize.width + cellSize.width / 2;
  const startY = (from.row + 1) * cellSize.height + cellSize.height / 2;
  const endX = (to.col + 1) * cellSize.width + cellSize.width / 2;
  const endY = (to.row + 1) * cellSize.height + cellSize.height / 2;
  
  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10
      }}
    >
      {/* Simple arrow line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        markerEnd="url(#arrowhead)"
      />
      
      {/* Arrow head marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={color}
          />
        </marker>
      </defs>
    </svg>
  );
};

interface MatrixData {
  cells: { [key: string]: CellData };
  arrows: ArrowData[];
}

export default function CareerPathMatrix() {
  const positions = [
    "Quản lý bảo dưỡng",
    "Phó phòng Quản lý thay đổi", 
    "Trưởng phòng Quản lý thay đổi",
    "Kỹ sư Quản lý thay đổi hệ thống mạng lõi",
    "Kỹ sư Quản lý thay đổi hệ thống mạng truy nhập",
    "Kỹ sư Quản lý thay đổi thị trường",
  ];

  const levels = ["Bậc 11", "Bậc 12", "Bậc 13", "Bậc 14", "Bậc 15", "Bậc 16", "Bậc 17"];

  // State management
  const [matrixData, setMatrixData] = useState<MatrixData>({
    cells: {},
    arrows: []
  });
  
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [editingText, setEditingText] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [selectedBgColor, setSelectedBgColor] = useState("#ffffff");
  const [isDrawingArrow, setIsDrawingArrow] = useState(false);
  const [arrowStart, setArrowStart] = useState<{ row: number; col: number } | null>(null);
  const [history, setHistory] = useState<MatrixData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalCell, setModalCell] = useState<{ row: number; col: number } | null>(null);

  const tableRef = useRef<HTMLTableElement>(null);
  const [cellSize, setCellSize] = useState({ width: 120, height: 60 });
  const [tableOffset, setTableOffset] = useState({ x: 0, y: 0 });

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('managementMatrixData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setMatrixData(parsed);
        addToHistory(parsed);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    } else {
      // Initialize with default data
      const defaultData: MatrixData = {
        cells: {
          "0-0": { text: "PvM0/1", color: "#000000", backgroundColor: "#e5f3ff" },
          "0-1": { text: "PvM2", color: "#000000", backgroundColor: "#e5f3ff" },
          "1-3": { text: "PP", color: "#000000", backgroundColor: "#e5f3ff" },
          "2-4": { text: "TP", color: "#000000", backgroundColor: "#e5f3ff" },
          "3-0": { text: "CM0/1", color: "#000000", backgroundColor: "#e5f3ff" },
          "3-1": { text: "CM2", color: "#000000", backgroundColor: "#e5f3ff" },
          "3-3": { text: "CM3", color: "#000000", backgroundColor: "#e5f3ff" },
          "4-0": { text: "CM0/1", color: "#000000", backgroundColor: "#e5f3ff" },
          "4-1": { text: "CM2", color: "#000000", backgroundColor: "#e5f3ff" },
          "4-3": { text: "CM3", color: "#000000", backgroundColor: "#e5f3ff" },
          "5-0": { text: "CM0/1", color: "#000000", backgroundColor: "#e5f3ff" },
          "5-1": { text: "CM2", color: "#000000", backgroundColor: "#e5f3ff" },
          "5-3": { text: "CM3", color: "#000000", backgroundColor: "#e5f3ff" },
        },
        arrows: []
      };
      setMatrixData(defaultData);
      addToHistory(defaultData);
    }
  }, []);

  // Calculate table dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (tableRef.current) {
        // Get actual table dimensions
        const tableRect = tableRef.current.getBoundingClientRect();
        const totalWidth = tableRect.width;
        const totalHeight = tableRect.height;
        
        // Calculate cell dimensions
        const cellWidth = totalWidth / (levels.length + 1); // +1 for position column
        const cellHeight = totalHeight / (positions.length + 1); // +1 for header row
        
        setCellSize({ width: cellWidth, height: cellHeight });
        
        // Calculate offset from container
        const containerRect = tableRef.current.closest('.p-4')?.getBoundingClientRect();
        if (containerRect) {
          setTableOffset({
            x: tableRect.left - containerRect.left,
            y: tableRect.top - containerRect.top
          });
        }
      }
    };

    // Delay to ensure table is rendered
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
    };
  }, [levels.length, positions.length]);

  // History management
  const addToHistory = (data: MatrixData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(data)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setMatrixData(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setMatrixData(history[historyIndex + 1]);
    }
  };

  // Cell operations
  const getCellKey = (row: number, col: number) => `${row}-${col}`;

  const getCellData = (row: number, col: number): CellData => {
    const key = getCellKey(row, col);
    return matrixData.cells[key] || { text: "", color: "#000000", backgroundColor: "#ffffff" };
  };

  const updateCell = (row: number, col: number, data: Partial<CellData>) => {
    const key = getCellKey(row, col);
    const newData = { ...matrixData };
    newData.cells[key] = { ...getCellData(row, col), ...data };
    setMatrixData(newData);
    addToHistory(newData);
  };

  const handleCellClick = (row: number, col: number) => {
    if (isDrawingArrow) {
      if (!arrowStart) {
        setArrowStart({ row, col });
        message.info('Đã chọn điểm bắt đầu. Click vào ô khác để vẽ mũi tên.');
      } else {
        // Create arrow
        const newArrow: ArrowData = {
          id: `arrow-${Date.now()}`,
          from: arrowStart,
          to: { row, col },
          color: selectedColor
        };
        
        const newData = { ...matrixData };
        newData.arrows.push(newArrow);
        setMatrixData(newData);
        addToHistory(newData);
        
        setIsDrawingArrow(false);
        setArrowStart(null);
        message.success('Đã tạo mũi tên thành công!');
      }
    } else {
      const cellData = getCellData(row, col);
      setEditingText(cellData.text);
      setSelectedColor(cellData.color);
      setSelectedBgColor(cellData.backgroundColor);
      setModalCell({ row, col });
      setIsModalVisible(true);
    }
  };

  const saveCellData = () => {
    if (modalCell) {
      updateCell(modalCell.row, modalCell.col, {
        text: editingText,
        color: selectedColor,
        backgroundColor: selectedBgColor
      });
      setIsModalVisible(false);
      setModalCell(null);
      message.success('Đã lưu dữ liệu ô!');
    }
  };

  const deleteArrow = (arrowId: string) => {
    const newData = { ...matrixData };
    newData.arrows = newData.arrows.filter(arrow => arrow.id !== arrowId);
    setMatrixData(newData);
    addToHistory(newData);
    message.success('Đã xóa mũi tên!');
  };

  const saveToStorage = () => {
    localStorage.setItem('managementMatrixData', JSON.stringify(matrixData));
    message.success('Đã lưu ma trận thành công!');
  };

  const clearAll = () => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa toàn bộ dữ liệu ma trận?',
      onOk: () => {
        const emptyData: MatrixData = { cells: {}, arrows: [] };
        setMatrixData(emptyData);
        addToHistory(emptyData);
        message.success('Đã xóa toàn bộ dữ liệu!');
      }
    });
  };

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => setIsDrawingArrow(false)}
            type={!isDrawingArrow ? "primary" : "default"}
          >
            Chỉnh sửa ô
          </Button>
          <Button 
            icon={<ArrowRightOutlined />} 
            onClick={() => {
              setIsDrawingArrow(true);
              setArrowStart(null);
              message.info('Chế độ vẽ mũi tên. Click vào ô để chọn điểm bắt đầu.');
            }}
            type={isDrawingArrow ? "primary" : "default"}
          >
            Vẽ mũi tên
          </Button>
        </Space>

        <Space>
          <Button icon={<UndoOutlined />} onClick={undo} disabled={historyIndex <= 0}>
            Hoàn tác
          </Button>
          <Button icon={<RedoOutlined />} onClick={redo} disabled={historyIndex >= history.length - 1}>
            Làm lại
          </Button>
        </Space>

        <Space>
          <Button icon={<SaveOutlined />} onClick={saveToStorage} type="primary">
            Lưu ma trận
          </Button>
          <Button icon={<DeleteOutlined />} onClick={clearAll} danger>
            Xóa tất cả
          </Button>
        </Space>

        {/* Color pickers */}
        <Space>
          <span>Màu chữ:</span>
          <ColorPicker 
            value={selectedColor} 
            onChange={(color) => setSelectedColor(color.toHexString())}
            size="small"
          />
          <span>Màu nền:</span>
          <ColorPicker 
            value={selectedBgColor} 
            onChange={(color) => setSelectedBgColor(color.toHexString())}
            size="small"
          />
        </Space>
      </div>

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
        <div className="p-4 relative">
          {/* SVG Arrows Layer */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {matrixData.arrows.map((arrow) => (
              <SVGArrow
                key={arrow.id}
                from={arrow.from}
                to={arrow.to}
                color={arrow.color}
                cellSize={cellSize}
                offset={tableOffset}
              />
            ))}
          </div>
          
          {/* Debug info */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs p-2 rounded">
            Cell: {cellSize.width.toFixed(0)}x{cellSize.height.toFixed(0)} | 
            Offset: {tableOffset.x.toFixed(0)},{tableOffset.y.toFixed(0)}
          </div>
          
          <table ref={tableRef} className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-blue-500 text-white p-2 text-left">Vị trí</th>
                {levels.map((lvl) => (
                  <th key={lvl} className="bg-blue-500 text-white p-2">{lvl}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions.map((pos, rowIndex) => (
                <tr key={pos} className="border-b">
                  <td className="bg-blue-100 p-2 font-medium">{pos}</td>
                  {levels.map((lvl, colIndex) => {
                    const cellData = getCellData(rowIndex, colIndex);
                    const isArrowStart = arrowStart?.row === rowIndex && arrowStart?.col === colIndex;
                    
                    return (
                      <td
                        key={colIndex}
                        className={`text-center p-2 border cursor-pointer relative min-w-[80px] min-h-[40px] ${
                          isArrowStart ? 'ring-2 ring-blue-500' : ''
                        }`}
                        style={{
                          backgroundColor: cellData.backgroundColor,
                          color: cellData.color,
                          position: 'relative'
                        }}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                        {cellData.text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Arrows list */}
      {matrixData.arrows.length > 0 && (
        <Card title="Danh sách mũi tên" className="mt-4">
          <div className="space-y-2">
            {matrixData.arrows.map((arrow) => (
              <div key={arrow.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>
                  Từ: {positions[arrow.from.row]} - {levels[arrow.from.col]} 
                  → 
                  Đến: {positions[arrow.to.row]} - {levels[arrow.to.col]}
                </span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: arrow.color }}
                  />
                  <Button 
                    size="small" 
                    icon={<DeleteOutlined />} 
                    onClick={() => deleteArrow(arrow.id)}
                    danger
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa ô"
        open={isModalVisible}
        onOk={saveCellData}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Nội dung:</label>
            <Input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              placeholder="Nhập nội dung..."
            />
          </div>
          
          <div>
            <label className="block mb-2">Màu chữ:</label>
            <ColorPicker 
              value={selectedColor} 
              onChange={(color) => setSelectedColor(color.toHexString())}
            />
          </div>
          
          <div>
            <label className="block mb-2">Màu nền:</label>
            <ColorPicker 
              value={selectedBgColor} 
              onChange={(color) => setSelectedBgColor(color.toHexString())}
            />
          </div>
          
          <div className="p-2 border rounded" style={{ backgroundColor: selectedBgColor, color: selectedColor }}>
            Xem trước: {editingText || "Nội dung mẫu"}
          </div>
        </div>
      </Modal>
    </div>
  );
}