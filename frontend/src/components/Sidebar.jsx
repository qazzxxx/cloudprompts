import React from 'react';
import { Layout, Menu, Button, Typography, Dropdown, Modal } from 'antd';
import { 
  RocketOutlined, PlusOutlined, AppstoreOutlined, 
  FolderOpenOutlined, StarOutlined, MoreOutlined,
  EditOutlined, DeleteOutlined, HolderOutlined,
  FormOutlined, CodeOutlined, PictureOutlined, ToolOutlined, 
  FileTextOutlined, BulbOutlined, RobotOutlined, CoffeeOutlined
} from '@ant-design/icons';
import {
  DndContext, 
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { Sider } = Layout;
const { Text } = Typography;

const ICON_MAP = {
  folder: <FolderOpenOutlined />,
  form: <FormOutlined />,
  code: <CodeOutlined />,
  picture: <PictureOutlined />,
  tool: <ToolOutlined />,
  file: <FileTextOutlined />,
  bulb: <BulbOutlined />,
  robot: <RobotOutlined />,
  coffee: <CoffeeOutlined />,
};

const SortableCategoryItem = ({ category, selected, onSelect, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : 'auto',
    position: 'relative',
    opacity: isDragging ? 0.5 : 1,
    height: 40,
    lineHeight: '40px',
    padding: '0 12px',
    margin: '4px 8px',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    backgroundColor: selected ? '#eef2ff' : 'transparent',
    color: selected ? '#4f46e5' : 'rgba(0, 0, 0, 0.88)',
  };

  const IconComponent = ICON_MAP[category.icon] || <FolderOpenOutlined />;
  // Handle hex color or preset color name. For simplicity, just use style color if it's hex, or map it.
  // Actually, standardizing on using the color directly is easiest if we assume hex or valid css.
  // If it's a preset name like 'blue', we might need a map or just let it fall back (ant icons don't support color name prop directly in style).
  const iconColor = category.color && category.color.startsWith('#') ? category.color : undefined;
  
  // Hover state handling via CSS class or inline (inline is harder for hover).
  // Let's rely on a wrapper class 'sidebar-item' and add some global css or just inline simple hover logic using state is overkill.
  // We can use a simple className and inject style.

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="sidebar-item"
      onClick={() => onSelect(category.id)}
      onMouseEnter={(e) => { if(!selected) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)' }}
      onMouseLeave={(e) => { if(!selected) e.currentTarget.style.backgroundColor = 'transparent' }}
    >
       <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          {/* Drag Handle */}
          <div 
            {...attributes} 
            {...listeners} 
            style={{ cursor: 'grab', color: '#cbd5e1', display: 'flex', alignItems: 'center', padding: 4 }} 
            onClick={e => e.stopPropagation()}
          >
             <HolderOutlined />
          </div>
          
          <span style={{ color: iconColor, fontSize: 16, display: 'flex', alignItems: 'center' }}>
             {IconComponent}
          </span>
          
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 14 }}>
             {category.name}
          </span>
       </div>

       <Dropdown
        menu={{
          items: [
            { key: 'edit', label: '编辑', icon: <EditOutlined />, onClick: (e) => { e.domEvent.stopPropagation(); onEdit(category); } },
            { key: 'delete', label: '删除', icon: <DeleteOutlined />, danger: true, onClick: (e) => { e.domEvent.stopPropagation(); onDelete(category.id); } }
          ]
        }}
        trigger={['click']}
      >
        <div onClick={(e) => e.stopPropagation()} style={{ padding: '4px 8px', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
          <MoreOutlined />
        </div>
      </Dropdown>
    </div>
  );
};

const Sidebar = ({ 
  categories, 
  selectedCategory, 
  onSelectCategory, 
  onAddProject, 
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorderCategories,
  showFavorites,
  onToggleFavorites
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      const newCategories = arrayMove(categories, oldIndex, newIndex);
      onReorderCategories(newCategories);
    }
  };

  const handleDeleteClick = (id) => {
    Modal.confirm({
        title: '确认删除分类？',
        content: '删除后该分类下的项目将变为"无分类"，此操作不可恢复。',
        okText: '确认删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            onDeleteCategory(id);
        }
    });
  };

  return (
    <Sider width={260} className="minimal-sider" theme="light" style={{ position: 'fixed', height: '100vh', left: 0, top: 0, zIndex: 10, borderRight: '1px solid #f1f5f9' }}>
      <div style={{ padding: '24px 24px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: '#4f46e5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <RocketOutlined style={{ fontSize: 18 }} />
        </div>
        <Text strong style={{ fontSize: 16, color: '#0f172a' }}>PromptBox</Text>
      </div>
      
      <div style={{ padding: '12px 20px' }}>
        <Button type="primary" block icon={<PlusOutlined />} onClick={onAddProject} style={{ borderRadius: 6, fontWeight: 500 }}>
          新建项目
        </Button>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[showFavorites ? 'fav' : (selectedCategory && !selectedCategory.toString().startsWith('cat') ? 'none' : 'all')]}
        style={{ border: 'none', padding: '0 8px' }}
        onClick={(e) => {
           if (e.key === 'fav') onToggleFavorites(true);
           else if (e.key === 'all') { onToggleFavorites(false); onSelectCategory(null); }
        }}
        items={[
          { key: 'all', icon: <AppstoreOutlined />, label: '全部项目', className: !selectedCategory && !showFavorites ? 'ant-menu-item-selected' : '' },
          { key: 'fav', icon: <StarOutlined />, label: '收藏夹' },
        ]}
      />

      <div style={{ padding: '16px 24px 8px', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
        分类库
      </div>

      <div style={{ padding: '0 8px', flex: 1, overflowY: 'auto' }}>
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={categories.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((category) => (
              <SortableCategoryItem
                key={category.id}
                category={category}
                selected={selectedCategory === category.id && !showFavorites}
                onSelect={onSelectCategory}
                onEdit={onEditCategory}
                onDelete={handleDeleteClick}
              />
            ))}
          </SortableContext>
        </DndContext>

        <div 
          onClick={onAddCategory}
          style={{ 
             padding: '0 12px', height: 40, display: 'flex', alignItems: 'center', gap: 10,
             cursor: 'pointer', margin: '4px 8px', borderRadius: 8, color: '#64748b', fontSize: 14
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <PlusOutlined style={{ fontSize: 14 }} />
          <span>新建分类</span>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
