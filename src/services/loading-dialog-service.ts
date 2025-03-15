import { reactive } from 'vue';

let counter = 1;

export interface LoadingContext {
  id: number;
  title: string;
  description: string;
  icon: string;
  setTitle: (_title: string) => void;
  setDescription: (_description: string) => void;
  setIcon: (_icon: string) => void;
  destroy: () => void;
}

export const loadingContexes: LoadingContext[] = reactive([]);

export function createLoadingContext(title?: string, description?: string, icon?: string) {
  const id = counter;
  counter += 1;
  const prioritize = () => {
    const idx = loadingContexes.findIndex((e) => e.id === id);
    if (idx > 0) {
      const el = loadingContexes.splice(idx, 1);
      loadingContexes.unshift(el[0]);
    }
  };
  const context = reactive({
    id,
    title: title || '',
    description: description || '',
    icon: icon || 'default',
    setTitle(_title: string) {
      this.title = _title;
      prioritize();
    },
    setDescription(_description: string) {
      this.description = _description;
      prioritize();
    },
    setIcon(_icon: string) {
      this.icon = _icon;
      prioritize();
    },
    destroy() {
      const idx = loadingContexes.findIndex((e) => e.id === id);
      // console.log({ idx });
      if (idx > -1) {
        loadingContexes.splice(idx, 1);
        // console.log({ length: loadingContexes.length });
      }
    },
  });

  loadingContexes.unshift(context);
  return context;
}
