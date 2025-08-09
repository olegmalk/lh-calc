import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Alert, Button, Container, Text, Title } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Container size="sm" py="xl">
          <Alert
            variant="light"
            color="red"
            title="Application Error"
            icon={<IconAlertTriangle size={20} />}
          >
            <Title order={4} mb="sm">
              Something went wrong
            </Title>
            <Text size="sm" mb="md">
              An error occurred while rendering this component. The application can continue to work, but this section may not function properly.
            </Text>
            <Text size="xs" c="dimmed" mb="md">
              Error: {this.state.error?.message}
            </Text>
            <Button size="sm" variant="outline" onClick={this.handleReset}>
              Try Again
            </Button>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

// Role-specific error boundary
export function RoleErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <Alert color="yellow" variant="light" title="Role System Error">
          <Text size="sm">
            The role system encountered an error. The application will continue to work with default permissions.
          </Text>
        </Alert>
      }
      onError={(error) => {
        console.warn('Role system error:', error);
        // Optionally reset role to a safe default
        try {
          localStorage.setItem('selected-role', 'technologist');
        } catch (e) {
          console.warn('Could not reset role in localStorage:', e);
        }
      }}
    >
      {children}
    </ErrorBoundary>
  );
}