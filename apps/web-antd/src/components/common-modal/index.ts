import type { VbenFormSchema } from '#/adapter/form';

import { createApp, defineComponent, h } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { useVbenForm } from '#/adapter/form';

export interface CommonModalOptions {
  title?: string;
  message?: string;
  tips?: string;
  type?: 'danger' | 'info' | 'primary' | 'success' | 'warning';
  icon?: string;
  schema: VbenFormSchema[];
}

export function openModal(
  options: CommonModalOptions,
): Promise<Record<string, any>> {
  return new Promise((resolve, reject) => {
    // 创建一个临时容器
    const container = document.createElement('div');
    document.body.append(container);

    // 卸载应用的函数
    const unmountApp = () => {
      app.unmount();
      container.remove();
    };

    // 创建一个组件来包装模态框
    const ModalComponent = defineComponent({
      setup() {
        // 创建表单
        const [Form, formApi] = useVbenForm({
          commonConfig: {
            componentProps: {
              class: 'w-full',
            },
            formItemClass: 'col-span-2',
          },
          layout: 'horizontal',
          schema: options.schema,
          showDefaultActions: false,
        });

        // 创建模态框
        const [Modal, modalApi] = useVbenModal({
          title: options.title || '提示',
          async onConfirm() {
            try {
              if (options.schema.length === 0) {
                resolve({});
                await modalApi.close();
                unmountApp();
                return;
              }

              const { valid } = await formApi.validate();
              if (!valid) {
                return;
              }

              modalApi.lock();
              const data = await formApi.getValues();
              resolve(data);
              await modalApi.close();
              unmountApp();
            } finally {
              modalApi.unlock();
            }
          },
          async onCancel() {
            reject(new Error('用户取消'));
            await modalApi.close();
            unmountApp();
          },
        });

        // 打开模态框
        modalApi.open();

        // 根据type获取默认图标
        const getDefaultIcon = () => {
          switch (options.type) {
            case 'danger': {
              return 'lucide:circle-x';
            }
            case 'info': {
              return 'lucide:info';
            }
            case 'success': {
              return 'lucide:check-circle';
            }
            case 'warning': {
              return 'lucide:alert-triangle';
            }
            default: {
              return 'lucide:circle-info';
            }
          }
        };

        // 根据type获取图标颜色
        const getIconColor = () => {
          switch (options.type) {
            case 'danger': {
              return '#ff4d4f';
            }
            case 'info': {
              return '#1890ff';
            }
            case 'success': {
              return '#52c41a';
            }
            case 'warning': {
              return '#faad14';
            }
            default: {
              return '#1890ff';
            }
          }
        };

        return () =>
          h(Modal, null, {
            default: () => [
              options.message
                ? h(
                    'div',
                    {
                      class:
                        'mb-4 flex items-center justify-center text-lg font-bold',
                    },
                    [
                      // 添加图标
                      h(IconifyIcon, {
                        icon: options.icon || getDefaultIcon(),
                        style: { marginRight: '8px', color: getIconColor() },
                        class: 'size-6',
                      }),
                      // 消息内容
                      options.message,
                    ],
                  )
                : null,
              options.tips
                ? h(
                    'div',
                    { class: 'mb-4 text-center text-sm text-gray-500' },
                    options.tips,
                  )
                : null,
              options.schema.length > 1 ? h(Form, { class: 'mx-4' }) : null,
            ],
          });
      },
    });

    // 创建应用实例
    const app = createApp(ModalComponent);

    // 挂载应用
    app.mount(container);
  });
}

export default openModal;
