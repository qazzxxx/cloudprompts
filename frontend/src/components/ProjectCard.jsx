import React from 'react';
import { Typography, Tag, Button,  Tooltip } from 'antd';
import { CodeOutlined,CheckOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;

const ProjectCard = ({ project, category, onClick, onToggleFavorite }) => {
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
      {/* 收藏按钮 - 移到右上角并增大点击区域 */}
      <div 
        style={{ 
          position: 'absolute', 
          top: 0, 
          right: 0, 
          padding: '16px',
          zIndex: 10,
          transition: 'transform 0.2s'
        }}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(project.id);
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {project.is_favorite ? (
          <StarFilled style={{ color: '#f59e0b', fontSize: 20 }} />
        ) : (
          <StarOutlined style={{ color: '#cbd5e1', fontSize: 20 }} />
        )}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            background: '#f1f5f9', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: '#4f46e5',
            flexShrink: 0
          }}>
            <CodeOutlined style={{ fontSize: 22 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title level={5} style={{ margin: 0, fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {project.name}
            </Title>
            {category && (
              <Tag bordered={false} style={{ margin: '4px 0 0 0', fontSize: 11, background: '#eef2ff', color: '#4f46e5' }}>
                {category.name}
              </Tag>
            )}
          </div>
        </div>
        
        <Paragraph 
          type="secondary" 
          ellipsis={{ rows: 2 }} 
          style={{ fontSize: 13, marginBottom: 0, lineHeight: '1.6', color: '#64748b' }}
        >
          {project.description || '暂无描述'}
        </Paragraph>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingTop: 16,
        borderTop: '1px solid #f1f5f9'
      }}>
        <Text type="secondary" style={{ fontSize: 12, color: '#94a3b8' }}>
          {dayjs(project.updated_at).fromNow()}
        </Text>
        <Button 
          type="link" 
          size="small" 
          style={{ 
            padding: 0, 
            fontSize: 13, 
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          详情 <CheckOutlined style={{ fontSize: 10, marginLeft: 4, display: 'none' }} /> 
          <span style={{ marginLeft: 2 }}>→</span>
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;
