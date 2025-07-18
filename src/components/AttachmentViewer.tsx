import React, { useState } from 'react';
import { X, Download, Eye, FileText, Image as ImageIcon, File } from 'lucide-react';
import { FileAttachment } from '../types';

interface AttachmentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: FileAttachment[];
  title: string;
}

export const AttachmentViewer: React.FC<AttachmentViewerProps> = ({ 
  isOpen, 
  onClose, 
  attachments, 
  title 
}) => {
  const [selectedAttachment, setSelectedAttachment] = useState<FileAttachment | null>(null);

  if (!isOpen) return null;

  const downloadAttachment = (attachment: FileAttachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAllAttachments = () => {
    attachments.forEach(attachment => {
      setTimeout(() => downloadAttachment(attachment), 100);
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-blue-500" />;
    } else if (type.includes('pdf')) {
      return <FileText className="h-5 w-5 text-red-500" />;
    } else if (type.includes('word') || type.includes('document')) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <div className="flex items-center gap-3">
            {attachments.length > 1 && (
              <button
                onClick={downloadAllAttachments}
                className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                下载全部
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* 附件列表 */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                附件列表 ({attachments.length})
              </h3>
              <div className="space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedAttachment?.id === attachment.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedAttachment(attachment)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1 min-w-0">
                        {getFileIcon(attachment.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadAttachment(attachment);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 预览区域 */}
          <div className="flex-1 overflow-auto">
            {selectedAttachment ? (
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {selectedAttachment.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(selectedAttachment.size)} • {selectedAttachment.type}
                      </p>
                    </div>
                    <button
                      onClick={() => downloadAttachment(selectedAttachment)}
                      className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      下载
                    </button>
                  </div>
                </div>

                {/* 文件预览 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  {selectedAttachment.type.startsWith('image/') ? (
                    <div className="bg-gray-50 p-4 text-center">
                      <img
                        src={selectedAttachment.url}
                        alt={selectedAttachment.name}
                        className="max-w-full max-h-96 mx-auto rounded shadow-lg"
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  ) : selectedAttachment.type.includes('pdf') ? (
                    <div className="bg-gray-50 p-8 text-center">
                      <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">PDF 文档预览</p>
                      <p className="text-sm text-gray-500 mb-4">
                        浏览器可能不支持直接预览PDF，请下载后查看
                      </p>
                      <iframe
                        src={selectedAttachment.url}
                        className="w-full h-96 border-0"
                        title={selectedAttachment.name}
                      />
                    </div>
                  ) : selectedAttachment.type.includes('text') ? (
                    <div className="bg-gray-50 p-4">
                      <iframe
                        src={selectedAttachment.url}
                        className="w-full h-96 border-0"
                        title={selectedAttachment.name}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-8 text-center">
                      <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">无法预览此文件类型</p>
                      <p className="text-sm text-gray-500 mb-4">
                        请下载文件后使用相应的应用程序打开
                      </p>
                      <button
                        onClick={() => downloadAttachment(selectedAttachment)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                      >
                        下载文件
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">选择左侧附件进行预览</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};