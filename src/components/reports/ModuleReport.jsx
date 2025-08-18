import { Document, Page, Text, View } from "@react-pdf/renderer";

const ModuleReport = () => (
  <Document>
    <Page size="A4">
      <View>
        <Text>Section #1</Text>
      </View>
      <View>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

export default ModuleReport;
