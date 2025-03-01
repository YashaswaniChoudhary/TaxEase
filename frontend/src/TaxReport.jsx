import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: { padding: 20 },
  section: { marginBottom: 10 },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 12 },
});

// Create the Tax Report component
const TaxReport = ({ taxDetails }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>Tax Report</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>Total Tax: ₹{taxDetails.totalTax}</Text>
        <Text style={styles.text}>Income: ₹{taxDetails.income}</Text>
        <Text style={styles.text}>Investments: ₹{taxDetails.investments80C}</Text>
        <Text style={styles.text}>Rent Paid: ₹{taxDetails.rentPaid}</Text>
      </View>
    </Page>
  </Document>
);

export default TaxReport;