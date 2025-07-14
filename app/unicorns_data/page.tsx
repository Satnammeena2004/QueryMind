//@ts-nocheck
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { readFileData } from "../actions";

const tableHead = [
  "Company",
  "Valuation ($B)",
  "Country",
  "City",
  "Industry",
  "Select Investors",
  "Date Joined",
] as const

type TableHeadType =typeof tableHead[number];

const Page = async () => {
  const r = await readFileData();
  return (
    <div>
      <Table>
        <TableRow>
          {tableHead.map((row) => (
            <TableHead
              className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              key={row}
            >
              {row}
            </TableHead>
          ))}
        </TableRow>
        <TableBody>
          
          {r.map((row, i:number) => (
            <TableRow key={i} className="">
              <TableCell>{row.Company}</TableCell>
              <TableCell>{row["Valuation ($B)"]}</TableCell>
              <TableCell>{row.Country}</TableCell>
              <TableCell>{row.City}</TableCell>
              <TableCell>{row.Industry}</TableCell>
              <TableCell>{row["Select Investors"]}</TableCell>
              <TableCell>{row["Date Joined"]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
