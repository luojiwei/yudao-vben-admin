export type FileType = 'doc' | 'docx' | 'pdf' | 'ppt' | 'pptx' | 'xls' | 'xlsx';

export type ImageType = 'gif' | 'jpeg' | 'jpg' | 'png';

export const imageTypeSet = new Set(['gif', 'jpeg', 'jpg', 'png']);

export const fileTypeSet = new Set([
  'doc',
  'docx',
  'pdf',
  'ppt',
  'pptx',
  'xls',
  'xlsx',
]);

export const isImage = (fileType: string) => imageTypeSet.has(fileType);

export const isFile = (fileType: string) => fileTypeSet.has(fileType);

let filePreviewInstance: any = null;

export function registerFilePreviewInstance(instance: any) {
  filePreviewInstance = instance;
}

export function openFilePreview({
  fileName,
  fileType,
  fileUrl,
}: {
  fileName: string;
  fileType: FileType;
  fileUrl: string;
}) {
  if (!filePreviewInstance) {
    console.error('FilePreview实例未初始化，请确保FilePreview组件已正确挂载');
    return;
  }

  filePreviewInstance.filePreview(fileUrl, fileName, fileType);
}

let imagePreviewInstance: any = null;

export function registerImagePreviewInstance(instance: any) {
  imagePreviewInstance = instance;
}

export function openImagePreview(urls: string[], index: number = 0) {
  if (!imagePreviewInstance) {
    console.error('ImagePreview实例未初始化，请确保ImagePreview组件已正确挂载');
    return;
  }

  imagePreviewInstance.imagePreview(urls, index);
}

export { default as DocxPreview } from './docx-preview.vue';
export { default as FilePreview } from './file-preview.vue';
export { default as ImagePreview } from './image-preview.vue';
export { default as PdfPreview } from './pdf-preview.vue';
export { default as PptxPreview } from './pptx-preview.vue';
export { default as TablePreviewCell } from './table-preview-cell.vue';
export { default as XlsxPreview } from './xlsx-preview.vue';
