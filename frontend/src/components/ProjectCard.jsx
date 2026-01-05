import React from 'react';
import { Typography, Tag, Button,  Tooltip, Dropdown } from 'antd';
import { 
  CodeOutlined, CheckOutlined, StarFilled, StarOutlined, 
  MoreOutlined, EditOutlined, DeleteOutlined, PictureOutlined, 
  FileTextOutlined, CopyOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

const ProjectCard = ({ project, category, onClick, onToggleFavorite, onCopyPrompt, onEdit, onDelete }) => {
  
  const menuItems = [
    {
      key: 'edit',
      label: '编辑信息',
      icon: <EditOutlined />,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onEdit(project);
      }
    },
    {
      key: 'delete',
      label: '删除项目',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onDelete(project.id);
      }
    }
  ];

  return (
    <div 
      className="clean-card" 
      onClick={onClick}
      style={{ 
        padding: '20px 24px', 
        cursor: 'pointer', 
        height: 220, 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Actions - Top Right */}
      <div
        style={{
            position: 'absolute',
            top: 16,
            right: 12,
            zIndex: 11,
            display: 'flex',
            alignItems: 'center',
            gap: 4
        }}
        onClick={(e) => e.stopPropagation()}
      >
         <div 
            onClick={(e) => {
              e.stopPropagation();
              onCopyPrompt(project.id);
            }}
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            className="hover-bg"
            title="复制最新版本提示词"
        >
            <CopyOutlined style={{ color: 'var(--text-secondary)', fontSize: 18 }} />
        </div>
        <div 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(project.id);
            }}
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            className="hover-bg"
            title={project.is_favorite ? "取消收藏" : "收藏"}
        >
            {project.is_favorite ? (
              <StarFilled style={{ color: '#f59e0b', fontSize: 18 }} />
            ) : (
              <StarOutlined style={{ color: 'var(--text-secondary)', fontSize: 18 }} />
            )}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            background: project.type === 'image' ? 'var(--tag-bg)' : 'var(--bg-color)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: project.type === 'image' ? '#d946ef' : 'var(--primary-color)',
            flexShrink: 0
          }}>
            {project.type === 'image' ? <PictureOutlined style={{ fontSize: 22 }} /> : <CodeOutlined style={{ fontSize: 22 }} />}
          </div>
          <div style={{ flex: 1, minWidth: 0, marginRight: 80 }}> {/* Increased margin to avoid overlap with top-right icons */}
            <Title level={5} style={{ margin: 0, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
              {project.name}
            </Title>
            {category && (
              <Tag bordered={false} style={{ margin: '4px 0 0 0', fontSize: 11, background: 'var(--tag-bg)', color: 'var(--primary-color)' }}>
                {category.name}
              </Tag>
            )}
          </div>
        </div>
        
        <Paragraph 
          ellipsis={{ rows: 2 }} 
          style={{ fontSize: 13, marginBottom: 0, lineHeight: '1.6', color: 'var(--text-secondary)' }}
        >
          {project.description || '暂无描述'}
        </Paragraph>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingTop: 16,
        borderTop: '1px solid var(--border-color)'
      }}>
        <Text style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          {dayjs(project.updated_at).fromNow()}
        </Text>
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
            <Button 
              type="text" 
              size="small"
              icon={<MoreOutlined style={{ fontSize: 18, color: 'var(--text-secondary)' }} />} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
