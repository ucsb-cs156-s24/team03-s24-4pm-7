import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import HelpRequestForm from "main/components/HelpRequest/HelpRequestForm";
import { helpRequestFixtures } from "fixtures/helpRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("HelpRequestForm tests", () => {

    const queryClient = new QueryClient();

    const expectedHeaders = ["requesterEmail", "teamId", "tableOrBreakoutRoom", "requestTime", "explanation", "solved"];
    const testId = "HelpRequestForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.queryByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });


    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <HelpRequestForm initialContents={helpRequestFixtures.oneHelpRequest} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.queryByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("Correct Error messages on bad input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId(`${testId}-tableOrBreakoutRoom`);
        const tableBreakout = screen.queryByTestId(`${testId}-tableOrBreakoutRoom`);
        const requestTime = screen.queryByTestId(`${testId}-requestTime`);
        const submitButton = screen.queryByTestId(`${testId}-submit`);

        fireEvent.change(tableBreakout, { target: { value: 'bad-input' } });
        fireEvent.change(requestTime, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/tableOrBreakoutRoom must be either the word table or the word breakout./);
    });

    test("Correct Error messages on missing input", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId(`${testId}-submit`);
        const submitButton = screen.queryByTestId(`${testId}-submit`);

        fireEvent.click(submitButton);

        await screen.findByText(/requesterEmail is required./);
        expect(screen.getByText(/requesterEmail is required./)).toBeInTheDocument();
        expect(screen.getByText(/teamId is required./)).toBeInTheDocument();
        expect(screen.getByText(/tableOrBreakoutRoom is required./)).toBeInTheDocument();
        expect(screen.getByText(/requestTime is required./)).toBeInTheDocument();
        expect(screen.getByText(/explanation is required./)).toBeInTheDocument();
    });

    test("No Error messages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <HelpRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId(`${testId}-submit`);
        
        const requesterEmail = screen.queryByTestId(`${testId}-requesterEmail`);
        const teamId = screen.queryByTestId(`${testId}-teamId`);
        const tableOrBreakoutRoom = screen.queryByTestId(`${testId}-tableOrBreakoutRoom`);
        const requestTime = screen.queryByTestId(`${testId}-requestTime`);
        const explanation = screen.queryByTestId(`${testId}-explanation`);
        const solved = screen.queryByTestId(`${testId}-solved`);
        const submitButton = screen.queryByTestId(`${testId}-submit`);

        fireEvent.change(requesterEmail, { target: { value: 'test@gmail.com' } });
        fireEvent.change(teamId, { target: { value: 'id7' } });
        fireEvent.change(tableOrBreakoutRoom, { target: { value: 'table' } });
        fireEvent.change(requestTime, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(explanation, { target: { value: 'sample explanation' } });
        fireEvent.change(solved, { target: { value: true } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/requesterEmail is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/teamId is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/tableOrBreakoutRoom is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/requestTime is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/tableOrBreakoutRoom must be either the word table or the word breakout./)).not.toBeInTheDocument();
        expect(screen.queryByText(/emailRegex must be in the form <name@domain.toplevel>./)).not.toBeInTheDocument();

        fireEvent.change(tableOrBreakoutRoom, { target: { value: 'breakout' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
        expect(screen.queryByText(/tableOrBreakoutRoom must be either the word table or the word breakout./)).not.toBeInTheDocument();

        fireEvent.change(tableOrBreakoutRoom, { target: { value: 'neither' } });
        fireEvent.change(requesterEmail, { target: { value: 'invalid' } });
        fireEvent.click(submitButton);
        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
        expect(screen.getByText(/tableOrBreakoutRoom must be either the word table or the word breakout./)).toBeInTheDocument();
        expect(screen.getByText(/emailRegex must be in the form <name@domain.toplevel>./)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <HelpRequestForm />
            </Router>
        );
        await screen.findByTestId(`${testId}-cancel`);
        const cancelButton = screen.queryByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


