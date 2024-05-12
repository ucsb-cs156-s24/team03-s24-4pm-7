import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import UCSBOrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UserTable tests", () => {
    const queryClient = new QueryClient();

    test("renders empty table correctly", () => {
    
      // arrange
      const currentUser = currentUserFixtures.adminUser;
  
      // act
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <UCSBOrganizationTable organizations={[]} currentUser={currentUser} />
          </MemoryRouter>
        </QueryClientProvider>
      );

      const expectedHeaders = ["OrgCode", "OrgTranslationShort", "OrgTranslation", "Inactive"];
      const expectedFields = ["orgCode", "orgTranslationShort", "orgTranslation", "inactive"];
      const testId = "UCSBOrganizationTable";
  
      // assert
      expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
      });
  
      expectedFields.forEach((field) => {
        const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(fieldElement).not.toBeInTheDocument();
      });
    });

    test("Has the expected column headers and content for ordinary user", () => {

        const currentUser = currentUserFixtures.userOnly;
    
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
    
        );
    
        const expectedHeaders = ["OrgCode", "OrgTranslationShort", "OrgTranslation", "Inactive"];
        const expectedFields = ["orgCode", "orgTranslationShort", "orgTranslation", "inactive"];
        const testId = "UCSBOrganizationTable";
    
        expectedHeaders.forEach((headerText) => {
          const header = screen.getByText(headerText);
          expect(header).toBeInTheDocument();
        });
    
        expectedFields.forEach((field) => {
          const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });
    
        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("3");
    
        const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).not.toBeInTheDocument();
    
        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();
    
      });

    test("Has the expected column headers and content for adminUser", async () => {

        const currentUser = currentUserFixtures.adminUser;

        render(
            <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
            </MemoryRouter>
            </QueryClientProvider>

        );

        const expectedHeaders = ["OrgCode", "OrgTranslationShort", "OrgTranslation", "Inactive"];
        const expectedFields = ["orgCode", "orgTranslationShort", "orgTranslation", "inactive"];
        const testId = "UCSBOrganizationTable";

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-orgCode`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-orgCode`)).toHaveTextContent("3");

        expect(screen.getByTestId(`${testId}-cell-row-0-col-inactive`)).toHaveTextContent("active");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-inactive`)).toHaveTextContent("inactive");

        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
        fireEvent.click(deleteButton);

    });

    test("Edit button navigates to the edit page for admin user", async () => {

        const currentUser = currentUserFixtures.adminUser;
    
        render(
          <QueryClientProvider client={queryClient}>
            <MemoryRouter>
              <UCSBOrganizationTable organizations={ucsbOrganizationFixtures.threeOrganizations} currentUser={currentUser} />
            </MemoryRouter>
          </QueryClientProvider>
    
        );
    
        await waitFor(() => { expect(screen.getByTestId(`UCSBOrganizationTable-cell-row-0-col-orgCode`)).toHaveTextContent("2"); });
    
        const editButton = screen.getByTestId(`UCSBOrganizationTable-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        
        fireEvent.click(editButton);
    
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/ucsborganizations/edit/2'));
    
      });

      
});