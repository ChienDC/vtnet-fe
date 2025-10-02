import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Button,
  Input,
  Select,
  Space,
  Modal,
  ColorPicker,
  message,
  Popconfirm,
  Row,
  Col,
  Divider,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  BgColorsOutlined,
  ArrowRightOutlined,
  ClearOutlined,
} from '@ant-design/icons';
// Mock data for development
const mockData = {
  career_matrix_templates: [
    { 
      id: 'mock-1', 
      name: 'Lộ trình Phát triển Phần mềm', 
      department: 'Công nghệ thông tin', 
      profession: 'Kỹ sư phần mềm',
      created_at: new Date().toISOString() 
    },
    { 
      id: 'mock-2', 
      name: 'Lộ trình Quản lý Dự án', 
      department: 'Quản lý', 
      profession: 'Project Manager',
      created_at: new Date().toISOString() 
    },
  ],
  career_matrix_cells: [],
  career_matrix_arrows: [],
};

const { Option } = Select;

interface Cell {
  id: string;
  row: number;
  col: number;
  positionName: string;
  levelName: string;
  content: string;
  backgroundColor: string;
  textColor: string;
}

interface Arrow {
  id: string;
  fromCellId: string;
  toCellId: string;
  arrowColor: string;
  label: string;
}

interface MatrixTemplate {
  id: string;
  name: string;
  department: string;
  profession: string;
}

const ManagementMatrix: React.FC = () => {
  const [matrices, setMatrices] = useState<MatrixTemplate[]>([]);
  const [currentMatrixId, setCurrentMatrixId] = useState<string | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [positions, setPositions] = useState<string[]>([
    'Quản lý bảo dưỡng',
    'Phó phòng Quản lý thay đổi',
    'Trưởng phòng Quản lý thay đổi',
    'Kỹ sư Quản lý thay đổi hệ thống mạng lõi',
  ]);

  const [levels, setLevels] = useState<string[]>([
    'Bậc 11',
    'Bậc 12',
    'Bậc 13',
    'Bậc 14',
    'Bậc 15',
  ]);

  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

  const [arrowMode, setArrowMode] = useState(false);
  const [arrowStart, setArrowStart] = useState<{ row: number; col: number } | null>(null);

  const [newMatrixModalVisible, setNewMatrixModalVisible] = useState(false);
  const [newMatrixName, setNewMatrixName] = useState('');
  const [newMatrixDepartment, setNewMatrixDepartment] = useState('');
  const [newMatrixProfession, setNewMatrixProfession] = useState('');

  const tableRef = useRef<HTMLDivElement>(null);
  const [cellPositions, setCellPositions] = useState<Map<string, DOMRect>>(new Map());

  useEffect(() => {
    loadMatrices();
  }, []);

  useEffect(() => {
    if (currentMatrixId) {
      loadMatrixData(currentMatrixId);
    }
  }, [currentMatrixId]);

  useEffect(() => {
    updateCellPositions();
    window.addEventListener('resize', updateCellPositions);
    return () => window.removeEventListener('resize', updateCellPositions);
  }, [cells, arrows]);

  const updateCellPositions = () => {
    if (!tableRef.current) return;

    const newPositions = new Map<string, DOMRect>();
    const table = tableRef.current;
    const allCells = table.querySelectorAll('[data-cell-id]');

    allCells.forEach((cellElement) => {
      const cellId = cellElement.getAttribute('data-cell-id');
      if (cellId) {
        const rect = cellElement.getBoundingClientRect();
        const tableRect = table.getBoundingClientRect();
        const relativeRect = new DOMRect(
          rect.left - tableRect.left,
          rect.top - tableRect.top,
          rect.width,
          rect.height
        );
        newPositions.set(cellId, relativeRect);
      }
    });

    setCellPositions(newPositions);
  };

  const loadMatrices = async () => {
    try {
      // Sử dụng mock data trực tiếp
      const data = mockData.career_matrix_templates;
      
      setMatrices(data || []);
      if (data && data.length > 0 && !currentMatrixId) {
        setCurrentMatrixId(data[0].id);
      }
    } catch (error) {
      console.error('Error loading matrices:', error);
      message.error('Không thể tải danh sách lộ trình');
    }
  };

  const loadMatrixData = async (matrixId: string) => {
    setIsLoading(true);
    try {
      // Sử dụng mock data trực tiếp
      const cellsData = mockData.career_matrix_cells;
      const arrowsData = mockData.career_matrix_arrows;

      const loadedCells: Cell[] = (cellsData || []).map((cell: any) => ({
        id: cell.id,
        row: cell.row_index,
        col: cell.col_index,
        positionName: cell.position_name || '',
        levelName: cell.level_name || '',
        content: cell.content || '',
        backgroundColor: cell.background_color || '#ffffff',
        textColor: cell.text_color || '#000000',
      }));

      setCells(loadedCells);

      const loadedArrows: Arrow[] = (arrowsData || []).map((arrow: any) => ({
        id: arrow.id,
        fromCellId: arrow.from_cell_id,
        toCellId: arrow.to_cell_id,
        arrowColor: arrow.arrow_color || '#1769FE',
        label: arrow.label || '',
      }));

      setArrows(loadedArrows);
    } catch (error) {
      console.error('Error loading matrix data:', error);
      message.error('Không thể tải dữ liệu lộ trình');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewMatrix = async () => {
    if (!newMatrixName.trim()) {
      message.warning('Vui lòng nhập tên lộ trình');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('career_matrix_templates')
        .insert([
          {
            name: newMatrixName,
            department: newMatrixDepartment,
            profession: newMatrixProfession,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      message.success('Tạo lộ trình mới thành công');
      setNewMatrixModalVisible(false);
      setNewMatrixName('');
      setNewMatrixDepartment('');
      setNewMatrixProfession('');
      loadMatrices();
      setCurrentMatrixId(data.id);
    } catch (error) {
      console.error('Error creating matrix:', error);
      message.error('Không thể tạo lộ trình mới');
    }
  };

  const getCellData = (row: number, col: number): Cell | undefined => {
    return cells.find((cell) => cell.row === row && cell.col === col);
  };

  const updateCellContent = (row: number, col: number, content: string) => {
    setCells((prev) => {
      const existing = prev.find((cell) => cell.row === row && cell.col === col);
      if (existing) {
        return prev.map((cell) =>
          cell.row === row && cell.col === col ? { ...cell, content } : cell
        );
      } else {
        return [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            row,
            col,
            positionName: positions[row] || '',
            levelName: levels[col] || '',
            content,
            backgroundColor: '#ffffff',
            textColor: '#000000',
          },
        ];
      }
    });
  };

  const updateCellColor = (row: number, col: number, backgroundColor: string) => {
    setCells((prev) => {
      const existing = prev.find((cell) => cell.row === row && cell.col === col);
      if (existing) {
        return prev.map((cell) =>
          cell.row === row && cell.col === col ? { ...cell, backgroundColor } : cell
        );
      } else {
        return [
          ...prev,
          {
            id: `temp-${Date.now()}`,
            row,
            col,
            positionName: positions[row] || '',
            levelName: levels[col] || '',
            content: '',
            backgroundColor,
            textColor: '#000000',
          },
        ];
      }
    });
    setColorPickerVisible(false);
  };

  const handleCellClick = (row: number, col: number) => {
    if (arrowMode) {
      if (!arrowStart) {
        setArrowStart({ row, col });
        message.info('Đã chọn ô bắt đầu, click vào ô đích để tạo mũi tên');
      } else {
        const fromCell = getCellData(arrowStart.row, arrowStart.col);
        const toCell = getCellData(row, col);

        if (fromCell && toCell) {
          setArrows((prev) => [
            ...prev,
            {
              id: `temp-arrow-${Date.now()}`,
              fromCellId: fromCell.id,
              toCellId: toCell.id,
              arrowColor: '#1769FE',
              label: '',
            },
          ]);
          message.success('Đã tạo mũi tên');
        }

        setArrowStart(null);
        setArrowMode(false);
      }
    }
  };

  const saveMatrix = async () => {
    if (!currentMatrixId) {
      message.warning('Vui lòng chọn hoặc tạo lộ trình mới');
      return;
    }

    setIsLoading(true);
    try {
      await supabase.from('career_matrix_cells').delete().eq('matrix_id', currentMatrixId);

      const cellsToInsert = cells.map((cell) => ({
        matrix_id: currentMatrixId,
        row_index: cell.row,
        col_index: cell.col,
        position_name: cell.positionName,
        level_name: cell.levelName,
        content: cell.content,
        background_color: cell.backgroundColor,
        text_color: cell.textColor,
      }));

      const { data: insertedCells, error: cellsError } = await supabase
        .from('career_matrix_cells')
        .insert(cellsToInsert)
        .select();

      if (cellsError) throw cellsError;

      const cellIdMap = new Map();
      insertedCells.forEach((insertedCell: any, index: number) => {
        const originalCell = cells[index];
        cellIdMap.set(originalCell.id, insertedCell.id);
      });

      await supabase.from('career_matrix_arrows').delete().eq('matrix_id', currentMatrixId);

      const arrowsToInsert = arrows
        .filter((arrow) => cellIdMap.has(arrow.fromCellId) && cellIdMap.has(arrow.toCellId))
        .map((arrow) => ({
          matrix_id: currentMatrixId,
          from_cell_id: cellIdMap.get(arrow.fromCellId),
          to_cell_id: cellIdMap.get(arrow.toCellId),
          arrow_color: arrow.arrowColor,
          label: arrow.label,
        }));

      if (arrowsToInsert.length > 0) {
        const { error: arrowsError } = await supabase
          .from('career_matrix_arrows')
          .insert(arrowsToInsert);

        if (arrowsError) throw arrowsError;
      }

      message.success('Đã lưu lộ trình thành công');
      loadMatrixData(currentMatrixId);
    } catch (error) {
      console.error('Error saving matrix:', error);
      message.error('Không thể lưu lộ trình');
    } finally {
      setIsLoading(false);
    }
  };

  const clearMatrix = () => {
    setCells([]);
    setArrows([]);
    message.success('Đã xóa tất cả dữ liệu lộ trình');
  };

  const deleteArrow = (arrowId: string) => {
    setArrows((prev) => prev.filter((arrow) => arrow.id !== arrowId));
  };

  const renderArrows = () => {
    if (arrows.length === 0 || cellPositions.size === 0) return null;

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#1769FE" />
          </marker>
        </defs>
        {arrows.map((arrow) => {
          const fromCell = cells.find((c) => c.id === arrow.fromCellId);
          const toCell = cells.find((c) => c.id === arrow.toCellId);

          if (!fromCell || !toCell) return null;

          const fromCellKey = `${fromCell.row}-${fromCell.col}`;
          const toCellKey = `${toCell.row}-${toCell.col}`;

          const fromRect = cellPositions.get(fromCellKey);
          const toRect = cellPositions.get(toCellKey);

          if (!fromRect || !toRect) return null;

          const startX = fromRect.left + fromRect.width / 2;
          const startY = fromRect.top + fromRect.height / 2;
          const endX = toRect.left + toRect.width / 2;
          const endY = toRect.top + toRect.height / 2;

          const dx = endX - startX;
          const dy = endY - startY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          const arrowLength = 10;
          const adjustedEndX = endX - (dx / distance) * arrowLength;
          const adjustedEndY = endY - (dy / distance) * arrowLength;

          // Tính toán control points dựa trên hướng của mũi tên
          let controlX1, controlY1, controlX2, controlY2;
          
          // Kiểm tra xem mũi tên là ngang hay dọc
          const isHorizontal = Math.abs(dx) > Math.abs(dy);
          
          if (isHorizontal) {
            // Mũi tên ngang - giữ nguyên logic cũ
            controlX1 = startX + dx * 0.25;
            controlY1 = startY;
            controlX2 = startX + dx * 0.75;
            controlY2 = endY;
          } else {
            // Mũi tên dọc - điều chỉnh control points
            controlX1 = startX;
            controlY1 = startY + dy * 0.25;
            controlX2 = endX;
            controlY2 = startY + dy * 0.75;
          }

          const path = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${adjustedEndX} ${adjustedEndY}`;

          return (
            <g key={arrow.id}>
              <path
                d={path}
                stroke={arrow.arrowColor}
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
                style={{
                  filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
                }}
              />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="fade-in">
      <Card
        className="modern-card"
        bodyStyle={{ padding: '28px 32px' }}
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Space size="middle">
              <Select
                style={{ width: 300 }}
                placeholder="Chọn lộ trình"
                value={currentMatrixId}
                onChange={setCurrentMatrixId}
              >
                {matrices.map((matrix) => (
                  <Option key={matrix.id} value={matrix.id}>
                    {matrix.name}
                  </Option>
                ))}
              </Select>

              <Button
                icon={<PlusOutlined />}
                onClick={() => setNewMatrixModalVisible(true)}
              >
                Tạo lộ trình mới
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type={arrowMode ? 'primary' : 'default'}
                icon={<ArrowRightOutlined />}
                onClick={() => {
                  setArrowMode(!arrowMode);
                  setArrowStart(null);
                }}
              >
                {arrowMode ? 'Đang nối mũi tên...' : 'Nối mũi tên'}
              </Button>

              <Popconfirm
                title="Xóa tất cả dữ liệu?"
                description="Bạn có chắc chắn muốn xóa tất cả dữ liệu lộ trình hiện tại?"
                onConfirm={clearMatrix}
                okText="Xóa"
                cancelText="Hủy"
              >
                <Button icon={<ClearOutlined />} danger>
                  Xóa tất cả
                </Button>
              </Popconfirm>

              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={saveMatrix}
                loading={isLoading}
              >
                Lưu lộ trình
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {arrows.length > 0 && (
        <Card
          className="modern-card"
          title="Danh sách mũi tên"
          bodyStyle={{ padding: '20px 24px' }}
          style={{ marginBottom: 24 }}
        >
          <Space wrap>
            {arrows.map((arrow) => {
              const fromCell = cells.find((c) => c.id === arrow.fromCellId);
              const toCell = cells.find((c) => c.id === arrow.toCellId);
              return (
                <Tag
                  key={arrow.id}
                  closable
                  onClose={() => deleteArrow(arrow.id)}
                  color="blue"
                >
                  {fromCell?.content || 'Ô bắt đầu'} → {toCell?.content || 'Ô đích'}
                </Tag>
              );
            })}
          </Space>
        </Card>
      )}

      <Card className="modern-card" bodyStyle={{ padding: 0 }}>
        <div
          ref={tableRef}
          style={{
            overflowX: 'auto',
            position: 'relative'
          }}
        >
          {renderArrows()}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: 800,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    background: '#1769FE',
                    color: 'white',
                    padding: '16px',
                    textAlign: 'left',
                    fontWeight: 600,
                    position: 'sticky',
                    left: 0,
                    zIndex: 10,
                  }}
                >
                  Vị trí
                </th>
                {levels.map((level, index) => (
                  <th
                    key={index}
                    style={{
                      background: '#1769FE',
                      color: 'white',
                      padding: '16px',
                      textAlign: 'center',
                      fontWeight: 600,
                      minWidth: 120,
                    }}
                  >
                    {level}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions.map((position, rowIndex) => (
                <tr key={rowIndex}>
                  <td
                    style={{
                      background: '#e0f2fe',
                      padding: '16px',
                      fontWeight: 600,
                      borderBottom: '1px solid #e8edf2',
                      position: 'sticky',
                      left: 0,
                      zIndex: 5,
                    }}
                  >
                    {position}
                  </td>
                  {levels.map((level, colIndex) => {
                    const cellData = getCellData(rowIndex, colIndex);
                    const isEditing =
                      editingCell?.row === rowIndex && editingCell?.col === colIndex;
                    const isArrowStart =
                      arrowStart?.row === rowIndex && arrowStart?.col === colIndex;

                    const hasArrowFrom = arrows.some(
                      (arrow) => arrow.fromCellId === cellData?.id
                    );
                    const hasArrowTo = arrows.some(
                      (arrow) => arrow.toCellId === cellData?.id
                    );

                    return (
                      <td
                        key={colIndex}
                        data-cell-id={`${rowIndex}-${colIndex}`}
                        style={{
                          background: cellData?.backgroundColor || '#f8fafc',
                          color: cellData?.textColor || '#000000',
                          padding: '12px',
                          textAlign: 'center',
                          borderBottom: '1px solid #e8edf2',
                          borderRight: '1px solid #e8edf2',
                          cursor: arrowMode ? 'pointer' : 'text',
                          position: 'relative',
                          minWidth: 120,
                          border: isArrowStart
                            ? '3px solid #1769FE'
                            : hasArrowFrom || hasArrowTo
                            ? '2px solid #10b981'
                            : '1px solid #e8edf2',
                        }}
                        onClick={() => handleCellClick(rowIndex, colIndex)}
                        onDoubleClick={() => {
                          if (!arrowMode) {
                            setEditingCell({ row: rowIndex, col: colIndex });
                          }
                        }}
                      >
                        {isEditing ? (
                          <Input
                            autoFocus
                            value={cellData?.content || ''}
                            onChange={(e) =>
                              updateCellContent(rowIndex, colIndex, e.target.value)
                            }
                            onBlur={() => setEditingCell(null)}
                            onPressEnter={() => setEditingCell(null)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              textAlign: 'center',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              minHeight: '24px',
                              fontWeight: cellData?.content ? 500 : 400,
                            }}
                          >
                            {cellData?.content || ''}
                          </div>
                        )}
                        <Button
                          type="text"
                          size="small"
                          icon={<BgColorsOutlined />}
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            opacity: 0.6,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCell({ row: rowIndex, col: colIndex });
                            setColorPickerVisible(true);
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        title="Chọn màu nền"
        open={colorPickerVisible}
        onCancel={() => setColorPickerVisible(false)}
        footer={null}
      >
        {selectedCell && (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <ColorPicker
              defaultValue={
                getCellData(selectedCell.row, selectedCell.col)?.backgroundColor || '#ffffff'
              }
              onChange={(color) => {
                const hexColor = color.toHexString();
                updateCellColor(selectedCell.row, selectedCell.col, hexColor);
              }}
              showText
              size="large"
            />
          </div>
        )}
      </Modal>

      <Modal
        title="Tạo lộ trình mới"
        open={newMatrixModalVisible}
        onOk={createNewMatrix}
        onCancel={() => {
          setNewMatrixModalVisible(false);
          setNewMatrixName('');
          setNewMatrixDepartment('');
          setNewMatrixProfession('');
        }}
        okText="Tạo"
        cancelText="Hủy"
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <div>
            <label>Tên lộ trình *</label>
            <Input
              placeholder="Nhập tên lộ trình"
              value={newMatrixName}
              onChange={(e) => setNewMatrixName(e.target.value)}
            />
          </div>
          <div>
            <label>Phòng ban</label>
            <Input
              placeholder="Nhập tên phòng ban"
              value={newMatrixDepartment}
              onChange={(e) => setNewMatrixDepartment(e.target.value)}
            />
          </div>
          <div>
            <label>Nghề nghiệp</label>
            <Input
              placeholder="Nhập nghề nghiệp"
              value={newMatrixProfession}
              onChange={(e) => setNewMatrixProfession(e.target.value)}
            />
          </div>
        </Space>
      </Modal>
    </div>
  );
};

export default ManagementMatrix;
