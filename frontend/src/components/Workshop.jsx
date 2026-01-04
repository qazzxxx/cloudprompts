import React, { useState, useEffect } from 'react';
import { Typography, Button, Input, Tabs, Timeline, Tag, Empty, message, Form, Breadcrumb, Popconfirm } from 'antd';
import { 
  LeftOutlined, EditOutlined, RobotOutlined, SaveOutlined, 
  CopyOutlined, CheckOutlined, DeleteOutlined, PlayCircleOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Workshop = ({ 
  project, 
  category, 
  versions, 
  onBack, 
  onSaveVersion, 
  onDeleteProject 
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [optimizedResult, setOptimizedResult] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Variables State
  const [variables, setVariables] = useState({});
  const [previewResult, setPreviewResult] = useState('');

  // Init
  useEffect(() => {
    if (versions.length > 0) {
      setPromptInput(versions[0].content);
    }
  }, [versions]);

  // Extract variables {{var}}
  useEffect(() => {
    const regex = /\{\{([^}]+)\}\}/g;
    const found = [];
    let match;
    while ((match = regex.exec(promptInput)) !== null) {
      found.push(match[1]);
    }
    // Only update if changed to avoid loop
    const newVars = { ...variables };
    let changed = false;
    found.forEach(v => {
      if (!(v in newVars)) {
        newVars[v] = '';
        changed = true;
      }
    });
    // Remove unused
    Object.keys(newVars).forEach(k => {
      if (!found.includes(k)) {
        delete newVars[k];
        changed = true;
      }
    });
    
    if (changed) setVariables(newVars);
  }, [promptInput]);

  const handleOptimize = () => {
    if (!promptInput) return;
    setIsOptimizing(true);
    setTimeout(() => {
      setOptimizedResult(`[AI 优化] ${promptInput}\n\n优化点:\n- 增加了角色设定\n- 明确了输出格式\n- 移除了模糊表述`);
      setIsOptimizing(false);
      message.success('优化完成');
    }, 1200);
  };

  const handleCopy = () => {
    const text = optimizedResult || promptInput;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    message.success('已复制到剪贴板');
  };

  const handleTestRun = () => {
    let text = promptInput;
    Object.keys(variables).forEach(key => {
      text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), variables[key] || `[${key}]`);
    });
    setPreviewResult(text);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button icon={<LeftOutlined />} type="text" onClick={onBack} style={{ color: '#64748b' }} />
          <Breadcrumb 
            items={[
              { title: <span style={{ cursor: 'pointer' }} onClick={onBack}>项目库</span> },
              { title: project.name }
            ]} 
          />
        </div>
        <Popconfirm title="确定删除项目？" onConfirm={() => onDeleteProject(project.id)} okText="删除" cancelText="取消" okType="danger">
          <Button type="text" danger icon={<DeleteOutlined />}>删除项目</Button>
        </Popconfirm>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 32 }}>
        <div>
          <Title level={2} style={{ margin: '0 0 8px 0', fontWeight: 600 }}>{project.name}</Title>
          <Text type="secondary" style={{ fontSize: 15 }}>{project.description || '暂无描述'}</Text>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <Tag color="purple">{category?.name}</Tag>
            {project.tags.map(t => <Tag key={t} bordered={false} style={{ background: '#f1f5f9', color: '#475569' }}>#{t}</Tag>)}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button icon={copied ? <CheckOutlined /> : <CopyOutlined />} onClick={handleCopy}>复制</Button>
          <Button type="primary" icon={<SaveOutlined />} onClick={() => onSaveVersion(optimizedResult || promptInput)}>保存版本</Button>
        </div>
      </div>

      {/* Editor Layout */}
      <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 250px)' }}>
        
        {/* Left: Editor */}
        <div className="clean-card" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text strong><EditOutlined /> 提示词编辑</Text>
            <Button type="primary" size="small" ghost icon={<RobotOutlined />} loading={isOptimizing} onClick={handleOptimize}>AI 优化</Button>
          </div>
          <TextArea 
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            style={{ flex: 1, resize: 'none', border: 'none', padding: 0, fontSize: 15, lineHeight: 1.6, boxShadow: 'none' }} 
            placeholder="输入提示词... 使用 {{variable}} 定义变量" 
          />
          
          {/* Variables Panel */}
          {Object.keys(variables).length > 0 && (
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text strong style={{ fontSize: 13 }}>变量测试</Text>
                <Button type="dashed" size="small" icon={<PlayCircleOutlined />} onClick={handleTestRun}>生成预览</Button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {Object.keys(variables).map(v => (
                  <Input 
                    key={v} 
                    addonBefore={v} 
                    value={variables[v]} 
                    onChange={e => setVariables({...variables, [v]: e.target.value})}
                    size="small"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Tabs */}
        <div className="clean-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Tabs 
            defaultActiveKey="1" 
            tabBarStyle={{ padding: '0 24px', margin: 0 }}
            items={[
              {
                key: '1',
                label: '预览/结果',
                children: (
                  <div style={{ padding: 24, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                    {previewResult ? (
                      <div>
                        <Tag color="green" style={{ marginBottom: 12 }}>预览模式</Tag>
                        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{previewResult}</Paragraph>
                      </div>
                    ) : optimizedResult ? (
                      <TextArea 
                        value={optimizedResult} 
                        readOnly 
                        style={{ flex: 1, resize: 'none', border: 'none', padding: 0, fontSize: 15, lineHeight: 1.6, boxShadow: 'none', background: 'transparent' }} 
                      />
                    ) : (
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无结果" style={{ marginTop: 60 }} />
                    )}
                  </div>
                )
              },
              {
                key: '2',
                label: '版本历史',
                children: (
                  <div style={{ padding: 24, overflowY: 'auto', height: '100%' }}>
                    <Timeline
                      items={versions.map(v => ({
                        color: '#4f46e5',
                        children: (
                          <div style={{ paddingBottom: 20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <Text strong>v{v.version_num}</Text>
                              <Text type="secondary" style={{ fontSize: 12 }}>{dayjs(v.created_at).format('MM-DD HH:mm')}</Text>
                            </div>
                            <div 
                              style={{ background: '#f8fafc', padding: 12, borderRadius: 8, fontSize: 13, color: '#334155', cursor: 'pointer' }}
                              onClick={() => setPromptInput(v.content)}
                              title="点击恢复此版本"
                            >
                              {v.content}
                            </div>
                          </div>
                        )
                      }))}
                    />
                  </div>
                )
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Workshop;
