import { Container, Title, Tabs, rem } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import {
  IconInfoCircle,
  IconFileText,
  IconTruck,
  IconTool,
  IconCurrencyDollar,
} from '@tabler/icons-react';
import { ProjectInfoSection } from '@components/ProjectDetails/ProjectInfoSection';
import { DocumentationSection } from '@components/ProjectDetails/DocumentationSection';
import { LogisticsSection } from '@components/ProjectDetails/LogisticsSection';
import { SparePartsSection } from '@components/ProjectDetails/SparePartsSection';
import { FinancialTermsSection } from '@components/ProjectDetails/FinancialTermsSection';

export function ProjectDetailsPage() {
  const { t } = useTranslation();
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Container size="xl">
      <Title order={1} mb="xl">
        {t('navigation.projectDetails')}
      </Title>

      <Tabs defaultValue="project-info" variant="outline" radius="md">
        <Tabs.List>
          <Tabs.Tab
            value="project-info"
            leftSection={<IconInfoCircle style={iconStyle} />}
          >
            {t('projectDetails.sections.projectInfo')}
          </Tabs.Tab>
          <Tabs.Tab
            value="documentation"
            leftSection={<IconFileText style={iconStyle} />}
          >
            {t('projectDetails.sections.documentation')}
          </Tabs.Tab>
          <Tabs.Tab
            value="logistics"
            leftSection={<IconTruck style={iconStyle} />}
          >
            {t('projectDetails.sections.logistics')}
          </Tabs.Tab>
          <Tabs.Tab
            value="spare-parts"
            leftSection={<IconTool style={iconStyle} />}
          >
            {t('projectDetails.sections.spareParts')}
          </Tabs.Tab>
          <Tabs.Tab
            value="financial-terms"
            leftSection={<IconCurrencyDollar style={iconStyle} />}
          >
            {t('projectDetails.sections.financialTerms')}
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="project-info" pt="lg">
          <ProjectInfoSection />
        </Tabs.Panel>

        <Tabs.Panel value="documentation" pt="lg">
          <DocumentationSection />
        </Tabs.Panel>

        <Tabs.Panel value="logistics" pt="lg">
          <LogisticsSection />
        </Tabs.Panel>

        <Tabs.Panel value="spare-parts" pt="lg">
          <SparePartsSection />
        </Tabs.Panel>

        <Tabs.Panel value="financial-terms" pt="lg">
          <FinancialTermsSection />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}