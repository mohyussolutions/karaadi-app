export interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'large';
  color?: string;
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}
