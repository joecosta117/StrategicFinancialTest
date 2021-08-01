import { render, screen } from "@testing-library/react";
import CreditorsTable from "./CreditorsTable";

test("renders learn react link", () => {
  render(<CreditorsTable />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
