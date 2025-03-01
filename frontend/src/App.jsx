import { useState } from "react";
import { Container,CssBaseline, Paper, Typography, Button, TextField, FormControlLabel, Switch, CircularProgress, MenuItem, Select, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Collapse, Divider} from "@mui/material";
import axios from "axios";
import { ThemeProvider } from "@mui/material/styles";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TaxReport from "./TaxReport";
import theme from "./theme";

console.log(TaxReport);

const App = () => {
  const [income, setIncome] = useState("");
  const [incomeType, setIncomeType] = useState("self-employed");
  const [standardDeduction, setStandardDeduction] = useState(0);
  const [basicSalary, setBasicSalary] = useState("auto"); // Auto-calculated by default
  const [customBasic, setCustomBasic] = useState(false);
  const [investments80C, setInvestments80C] = useState("");
  const [rentPaid, setRentPaid] = useState("");
  const [cityType, setCityType] = useState("non-metro");
  const [tax, setTax] = useState(null);
  const [taxBreakdown, setTaxBreakdown] = useState([]);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [errors, setErrors] = useState({});
  // const [showAlert, setShowAlert] = useState(false);

  const validateInputs = () => {
    let newErrors = {};
    if (!income || isNaN(income) || income <= 0) newErrors.income = "Please enter a valid income.";
    if (investments80C && (isNaN(investments80C) || investments80C < 0)) newErrors.investments = "Enter a valid investment amount.";
    if (rentPaid && (isNaN(rentPaid) || rentPaid < 0)) newErrors.rentPaid = "Enter a valid rent amount.";
    if (customBasic && (!basicSalary || isNaN(basicSalary) || basicSalary < 0)) newErrors.basicSalary = "Enter a valid basic salary.";
    
    setErrors(newErrors);
    // setShowAlert(Object.keys(newErrors).length > 0);
    return Object.keys(newErrors).length === 0;
  };

  const handleIncomeChange = (e) => {
    const value = e.target.value;
    setIncome(value);
    if (!customBasic) {
      setBasicSalary(value ? (0.4 * value).toFixed(2) : "");
    }
  };

  const calculateTax = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/tax/calculate", {
        income: Number(income),
        basicSalary: customBasic ? Number(basicSalary) : 0.4 * Number(income),
        investments80C: Number(investments80C),
        rentPaid: Number(rentPaid),
        cityType,
        incomeType,
      });
      setTax(response.data.totalTax);
      setTaxBreakdown(response.data.taxBreakdown);
      setStandardDeduction(response.data.deductions.standardDeduction);
      setShowBreakdown(true);
    } catch (error) {
      console.error("Error calculating tax:", error);
    }
    setLoading(false);
  };
  
  const downloadExcel = (taxData) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tax Report");
  
    worksheet.columns = [
      { header: "Tax Slab", key: "slab", width: 20 },
      { header: "Tax Rate", key: "rate", width: 15 },
      { header: "Tax Amount (₹)", key: "tax", width: 20 },
    ];
  
    taxData.forEach((item) => worksheet.addRow(item));
  
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, "TaxReport.xlsx");
    });
  };
  
  console.log("Tax Report Data:", { totalTax: tax, income, investments80C, rentPaid });
  return (
    <ThemeProvider theme={theme(darkMode ? "dark" : "light")}>
     <CssBaseline /> 
    <Container maxWidth="md">
      <FormControlLabel
        control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
        label="Dark Mode"
      />

      {/* {showAlert && Object.keys(errors).length > 0 && (
       <Alert severity="error" sx={{ mb: 2 }} onClose={() => setShowAlert(false)}>
          Please fix the errors in the form.
       </Alert>
      )} */}

      <Paper elevation={3} sx={{ padding: 3, marginTop: 4}}>
        <Typography variant="h4">TaxEase - Smart Tax Assistant</Typography>        

        <Divider sx={{ mb: 2 }} />
        <Typography variant="h6">Income</Typography>
        <TextField label="Annual Income (₹)" fullWidth margin="normal" value={income} onChange={handleIncomeChange} type="number" error={!!errors.income} helperText={errors.income}/>
        
        <Select fullWidth margin="normal" value={incomeType} onChange={(e) => setIncomeType(e.target.value)}>
          <MenuItem value="salaried">Salaried</MenuItem>
          <MenuItem value="self-employed">Business/Self-Employed</MenuItem>
          <MenuItem value="pensioner">Pensioner</MenuItem>
        </Select>

        {incomeType !== "self-employed" && (
          <Typography variant="body1" sx={{ mt: 1 }}>
            Standard Deduction: ₹{standardDeduction}
          </Typography>
        )}
         
         <Divider sx={{ mt: 2, mb: 2 }} />

        <Typography variant="h6">Deductions</Typography>
        <TextField label="Investments (PPF, EPF, LIC, NSC - ₹ per year)" fullWidth margin="normal" value={investments80C} onChange={(e) => setInvestments80C(e.target.value)} type="number"  error={!!errors.investments80C} helperText={errors.investments80C} />
        <TextField label="Rent Paid (₹ per month)" fullWidth margin="normal" value={rentPaid} onChange={(e) => setRentPaid(e.target.value)} type="number" error={!!errors.rentPaid} helperText={errors.rentPaid} />
        <Divider sx={{ mt: 2, mb: 2 }} />
         
        <Typography variant="h6">Customize</Typography>
        <Select fullWidth sx={{ mt: 2 }} margin="normal" value={cityType} onChange={(e) => setCityType(e.target.value)}>
          <MenuItem value="metro">Metro City</MenuItem>
          <MenuItem value="non-metro">Non-Metro City</MenuItem>
        </Select>

      <TextField
        label="Basic Salary (₹ per year)"
        fullWidth
        margin="normal"
        value={customBasic ? basicSalary : (0.4 * Number(income) || 0).toFixed(2)}
        onChange={(e) => setBasicSalary(e.target.value)}
        type="number"
        disabled={!customBasic} // Disable input unless customBasic is enabled
        error={!!errors.basicSalary} helperText={errors.basicSalary}
      />

      <FormControlLabel
        control={<Switch checked={customBasic} onChange={() => setCustomBasic(!customBasic)} />}
        label="Enter Custom Basic Salary"
      />
        <Button variant="contained" onClick={calculateTax} fullWidth sx={{ mt: 2 }} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Calculate Tax"}
        </Button>       

        <Button 
          variant="outlined" 
          color="secondary" 
          fullWidth 
          sx={{ mt: 2 }} 
          onClick={() => {
           setIncome("");
           setIncomeType("self-employed");
           setStandardDeduction(0);
           setBasicSalary("auto");
           setCustomBasic(false);
           setInvestments80C("");
           setRentPaid("");
           setCityType("non-metro");
           setTax(null);
           setTaxBreakdown([]);
           setShowBreakdown(false);
           setErrors({});
          }}
        >
          Reset
        </Button>

        {tax !== null && (
          <>
            <Typography variant="h6" sx={{ mt: 3 }}>Total Tax: ₹{tax}</Typography>
              <Button variant="outlined" onClick={() => setShowBreakdown(!showBreakdown)}>
                {showBreakdown ? "Hide Tax Breakdown" : "View Tax Breakdown"}
              </Button>
              <Collapse in={showBreakdown} timeout="auto" unmountOnExit>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Tax Slab</TableCell>
                        <TableCell>Tax Rate</TableCell>
                        <TableCell>Tax Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {taxBreakdown.map((item, index) => {
                      console.log("Tax Amount:", item.tax, typeof item.tax); // Debugging statement
                      return (
                       <TableRow key={index}>
                       <TableCell>{item.slab}</TableCell>
                       <TableCell>{item.rate}</TableCell>
                       <TableCell>
                         {Number(item.tax.replace(/[^0-9.]/g, "")).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                       </TableCell>
                       </TableRow>
                      );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Collapse>
              <Button variant="contained" sx={{ mt: 2, mr: 2 }} onClick={downloadExcel}>Download Excel</Button>
              
              <PDFDownloadLink
                document={<TaxReport taxDetails={{ totalTax: tax, income, investments80C, rentPaid }} />}
                fileName="Tax_Report.pdf"
                style={{ textDecoration: "none" }}
              >
              {({ loading }) =>
                loading ? (
                <Button variant="contained" sx={{ mt: 2, mr: 2 }} disabled>
                 Generating PDF...
                </Button>
                ) : (
                <Button variant="contained" sx={{ mt: 2, mr: 2 }} color="primary">
                 Download PDF
                </Button>
              )}
            </PDFDownloadLink>
          </>
        )}
      </Paper>
    </Container>
    </ThemeProvider>
  );
};

export default App;