import { Container, Title, Text, Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function CalculationsPage() {
  const navigate = useNavigate();

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={2}>Calculations</Title>
        <Text size="lg" c="dimmed">
          View and manage your calculations here.
        </Text>
        
        <Button 
          onClick={() => navigate('/dashboard')} 
          size="lg"
          style={{ alignSelf: 'flex-start' }}
        >
          Go to Calculator
        </Button>
      </Stack>
    </Container>
  );
}