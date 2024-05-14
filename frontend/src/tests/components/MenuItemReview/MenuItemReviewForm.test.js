import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["itemId", "reviewerEmail", "stars", "dateReviewed", "comments"];
    const testId = "MenuItemReviewForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneMenuItemReview} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });

    test("No Error messages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <MenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId(`${testId}-submit`);

        const itemId = screen.getByTestId(`${testId}-itemId`);
        const reviewerEmail = screen.getByTestId(`${testId}-email`);
        const stars = screen.getByTestId(`${testId}-stars`);
        const dateReviewed = screen.getByTestId(`${testId}-dateReviewed`);
        const comments = screen.getByTestId(`${testId}-comments`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(itemId, { target: { value: '1' } });
        fireEvent.change(reviewerEmail, { target: { value: 'test@gmail.com' } });
        fireEvent.change(stars, { target: { value: '5' } });
        fireEvent.change(dateReviewed, { target: { value: '2022-01-02T12:00' } });
        fireEvent.change(comments, { target: { value: 'sample comment' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/itemId is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/reviewerEmail is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/stars is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/dateReviewed is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/dateReviewed is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/stars must be a numerical value/)).not.toBeInTheDocument();
        expect(screen.queryByText(/itemId must be a numerical value/)).not.toBeInTheDocument();
        expect(screen.queryByText(/reviewerEmail must be a valid email address/)).not.toBeInTheDocument();
    });



    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <MenuItemReviewForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/itemId is required./);
        expect(screen.getByText(/reviewerEmail is required./)).toBeInTheDocument();
        expect(screen.getByText(/stars is required./)).toBeInTheDocument();
        expect(screen.getByText(/dateReviewed is required./)).toBeInTheDocument();
        expect(screen.getByText(/comments is required./)).toBeInTheDocument();

        const emailInput = screen.getByTestId(`${testId}-email`);
        fireEvent.change(emailInput, { target: { value: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@gmail.com" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
        });

        const emailInput2 = screen.getByTestId(`${testId}-email`);
        fireEvent.change(emailInput2, { target: { value: "something" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/reviewerEmail must be a valid email address/)).toBeInTheDocument();
        });

        const commentsInput = screen.getByTestId(`${testId}-comments`);
        fireEvent.change(commentsInput, { target: { value: "a".repeat(51) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 50 characters/)).toBeInTheDocument();
        });

        const itemIdInput = screen.getByTestId(`${testId}-itemId`);
        fireEvent.change(itemIdInput, { target: { value: "a" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/itemId must be a numerical value/)).toBeInTheDocument();
        });

        const starsInput = screen.getByTestId(`${testId}-stars`);
        fireEvent.change(starsInput, { target: { value: "a" } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/stars must be a numerical value/)).toBeInTheDocument();
        });

    });

});