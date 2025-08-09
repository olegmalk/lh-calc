import { Group, Title, ActionIcon, Select, useMantineColorScheme } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
// import { RoleSelector } from '../Navigation/RoleSelector';
// import { RoleErrorBoundary } from '../ErrorBoundary';

export function AppHeader() {
  const { t, i18n } = useTranslation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const handleLanguageChange = (value: string | null) => {
    if (value) {
      i18n.changeLanguage(value);
    }
  };

  return (
    <>
      <Title order={3} size="h4">{t('app.title')}</Title>
      <Group ml="auto" gap="xs">
        {/* <RoleErrorBoundary>
          <RoleSelector />
        </RoleErrorBoundary> */}
        <Select
          value={i18n.language}
          onChange={handleLanguageChange}
          data={[
            { value: 'en', label: 'EN' },
            { value: 'ru', label: 'RU' },
          ]}
          w={70}
          size="xs"
        />
        <ActionIcon
          onClick={() => toggleColorScheme()}
          variant="default"
          size="md"
          aria-label="Toggle color scheme"
        >
          {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
        </ActionIcon>
      </Group>
    </>
  );
}