import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("UCSBOrganizationForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByText(/orgCode/);
        await screen.findByText(/Create/);
    });

    test("renders correctly when passing in a UCSBOrganization", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm initialContents={ucsbOrganizationFixtures.oneOrganization} />
            </Router>
        );
        expect(screen.getByText(/orgCode/)).toBeInTheDocument();
        await screen.findByTestId(/UCSBOrganizationForm-orgCode/);
        expect(screen.getByTestId(/UCSBOrganizationForm-orgCode/)).toHaveValue("1");
    });

    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        fireEvent.change(orgTranslationShortField, { target: { value: 'bad-input' } });
        fireEvent.change(orgTranslationField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        expect(screen.queryByText(/OrgTranslationShort is required./)).not.toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-submit");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        fireEvent.click(submitButton);
        
        await screen.findByText(/orgCode is required./);
        expect(screen.getByText(/OrgTranslationShort is required./)).toBeInTheDocument();
        expect(screen.getByText(/inactive is required./)).toBeInTheDocument();
        expect(screen.getByText(/OrgTranslation is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <UCSBOrganizationForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-orgCode");

        const orgCodeField = screen.getByTestId("UCSBOrganizationForm-orgCode");
        const orgTranslationShortField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
        const orgTranslationField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
        const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
        const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

        fireEvent.change(orgCodeField, { target: { value: "1" } });
        fireEvent.change(orgTranslationShortField, { target: { value: "CSSA" } });
        fireEvent.change(orgTranslationField, { target: { value: "Chinese Students and Scholars Association" } });
        fireEvent.change(inactiveField, { target: { value: "true" } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/orgCode is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/OrgTranslationShort is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/OrgTranslation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/inactive is required./)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <UCSBOrganizationForm />
            </Router>
        );
        await screen.findByTestId("UCSBOrganizationForm-cancel");
        const cancelButton = screen.getByTestId("UCSBOrganizationForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });
    
});