import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticlesPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Article");
            expect(screen.queryByTestId("Article-title")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: "The Daily Nexus",
                url: "dailynexus.com",
                explanation: "This is the Daily Nexus homepage",
                email: "d@nexus.com",
                localDateTime: "2022-02-02T00:00"
            });
            axiosMock.onPut('/api/articles').reply(200, {
                id: "17",
                title: "The Daily Nexus",
                url: "dailynexus.com",
                explanation: "This is the Daily Nexus homepage",
                email: "d@nexus.com",
                localDateTime: "2022-02-02T00:00"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-id");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateField = screen.getByTestId("ArticlesForm-localDateTime");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(titleField).toBeInTheDocument();
            expect(titleField).toHaveValue("The Daily Nexus");
            expect(urlField).toBeInTheDocument();
            expect(urlField).toHaveValue("dailynexus.com");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("This is the Daily Nexus homepage");
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("d@nexus.com");
            expect(dateField).toBeInTheDocument();
            expect(dateField).toHaveValue("2022-02-02T00:00");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(titleField, { target: { value: 'Fox News' } });
            fireEvent.change(urlField, { target: { value: 'fox.com' } });
            fireEvent.change(explanationField, { target: { value: 'This is the Fox News homepage' } });
            fireEvent.change(emailField, { target: { value: 'f@fox.com' } });
            fireEvent.change(dateField, { target: { value: '2018-02-02T00:00' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Article Updated - id: 17 title: The Daily Nexus");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "Fox News",
                url: "fox.com",
                explanation: "This is the Fox News homepage",
                email: "f@fox.com",
                localDateTime: "2018-02-02T00:00"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-id");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateField = screen.getByTestId("ArticlesForm-localDateTime");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("The Daily Nexus");
            expect(urlField).toHaveValue("dailynexus.com");
            expect(explanationField).toHaveValue("This is the Daily Nexus homepage");
            expect(emailField).toHaveValue("d@nexus.com");
            expect(dateField).toHaveValue("2022-02-02T00:00");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: 'The Daily Nexus' } })
            fireEvent.change(urlField, { target: { value: 'dailynexus.com' } })
            fireEvent.change(explanationField, { target: { value: 'This is the Fox News homepage' } });
            fireEvent.change(emailField, { target: { value: 'f@fox.com' } });
            fireEvent.change(dateField, { target: { value: '2018-02-02T00:00' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Article Updated - id: 17 title: The Daily Nexus");
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });
        });

       
    });
});
