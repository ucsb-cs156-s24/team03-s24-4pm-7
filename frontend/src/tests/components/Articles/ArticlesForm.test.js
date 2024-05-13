import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";

import { QueryClient, QueryClientProvider } from "react-query";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("ArticlesForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Title", "URL", "Explanation", "Email", "Date"];
    const testId = "ArticlesForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in an Article", async () => {

        render(
            <Router  >
                <ArticlesForm initialContents={articlesFixtures.oneArticle} />
            </Router>
        );
        await screen.findByTestId(`${testId}-id`);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-id`)).toHaveValue("1");

        expect(screen.getByText(/Title/)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-title`)).toHaveValue("Google");

        expect(screen.getByText(/URL/)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-url`)).toHaveValue("google.com");

        expect(screen.getByText(/Explanation/)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-explanation`)).toHaveValue("this is google search engine");

        expect(screen.getByText(/Email/)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-email`)).toHaveValue("g@gmail.com");

        expect(screen.getByText(/Date/)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-localDateTime`)).toHaveValue("2022-01-02T12:00");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId(`${testId}-title`);
        const titleField = screen.getByTestId(`${testId}-title`);
        const urlField = screen.getByTestId(`${testId}-url`);
        const explanationField = screen.getByTestId(`${testId}-explanation`);
        const emailField = screen.getByTestId(`${testId}-email`);
        const localDateTimeField = screen.getByTestId(`${testId}-localDateTime`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(titleField, { target: { value: 'bad-input' } });
        fireEvent.change(urlField, { target: { value: 'bad-input' } });
        fireEvent.change(explanationField, { target: { value: 'bad-input' } });
        fireEvent.change(emailField, { target: { value: 'bad-input' } });
        fireEvent.change(localDateTimeField, { target: { value: '2022' } });
        fireEvent.click(submitButton);

        // await screen.findByText(/QuarterYYYYQ must be in the format YYYYQ/);
        const nameInput = screen.getByTestId(`${testId}-title`);
        fireEvent.change(nameInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
        });

        const urlInput = screen.getByTestId(`${testId}-url`);
        fireEvent.change(urlInput, { target: { value: "a".repeat(21) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 20 characters/)).toBeInTheDocument();
        });

        const explanationInput = screen.getByTestId(`${testId}-explanation`);
        fireEvent.change(explanationInput, { target: { value: "a".repeat(101) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 100 characters/)).toBeInTheDocument();
        });

        const emailInput = screen.getByTestId(`${testId}-email`);
        fireEvent.change(emailInput, { target: { value: "a".repeat(26) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 25 characters/)).toBeInTheDocument();
        });

        const dateInput = screen.getByTestId(`${testId}-localDateTime`);
        fireEvent.change(dateInput, { target: { value: "2022-01-02T12".repeat(26) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/LocalDateTime is required/)).toBeInTheDocument();
        });

    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId(`${testId}-submit`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.click(submitButton);

        await screen.findByText(/Title is required/);
        expect(screen.getByText(/Title is required/)).toBeInTheDocument();
        expect(screen.getByText(/URL is required/)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
        expect(screen.getByText(/Email is required/)).toBeInTheDocument();
        expect(screen.getByText(/LocalDateTime is required/)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <ArticlesForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId(`${testId}-title`);

        const titleField = screen.getByTestId(`${testId}-title`);
        const urlField = screen.getByTestId(`${testId}-url`);
        const explanationField = screen.getByTestId(`${testId}-explanation`);
        const emailField = screen.getByTestId(`${testId}-email`);
        const localDateTimeField = screen.getByTestId(`${testId}-localDateTime`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(titleField, { target: { value: 'Yahoo' } });
        fireEvent.change(urlField, { target: { value: 'yahoo.com' } });
        fireEvent.change(explanationField, { target: { value: 'explanation of yahoo' } });
        fireEvent.change(emailField, { target: { value: 'y@yahoo.com' } });
        fireEvent.change(localDateTimeField, { target: { value: '2022-01-02T12:00' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        // expect(screen.queryByText(/QuarterYYYYQ must be in the format YYYYQ/)).not.toBeInTheDocument();
        expect(screen.queryByText(/localDateTime must be in ISO format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Title is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/URL is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Email is required/)).not.toBeInTheDocument();
        expect(screen.queryByText(/LocalDateTime is required/)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <ArticlesForm />
            </Router>
        );
        await screen.findByTestId(`${testId}-cancel`);
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);
        const mockSubmit = screen.getByTestId(`${testId}-submit`);
        fireEvent.change(mockSubmit, { target: { value: "" } });

        await screen.findByText(/Title is required/);
        expect(screen.getByText(/Title is required/)).toBeInTheDocument();
        expect(screen.getByText(/URL is required/)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
        expect(screen.getByText(/Email is required/)).toBeInTheDocument();
        expect(screen.getByText(/LocalDateTime is required/)).toBeInTheDocument();

    });

});


