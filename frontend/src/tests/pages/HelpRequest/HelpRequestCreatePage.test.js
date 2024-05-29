import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import HelpRequestCreatePage from "main/pages/HelpRequest/HelpRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /helprequest", async () => {

        const queryClient = new QueryClient();
        const helpRequest = {
            id: 3,
            requesterEmail: "createpage@gmail.com",
            teamId: "team_create_page",
            tableOrBreakoutRoom: "table",
            requestTime: "2022-01-02T12:00:00",
            explanation: "testing create page for HelpRequest",
            solved: "false"
        };

        axiosMock.onPost("/api/helprequest/post").reply(202, helpRequest);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <HelpRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("requesterEmail")).toBeInTheDocument();
        });


        const requesterEmail = screen.getByLabelText("requesterEmail");
        expect(requesterEmail).toBeInTheDocument();
        const teamId = screen.getByLabelText("teamId");
        expect(teamId).toBeInTheDocument();
        const tableOrBreakoutRoom = screen.getByLabelText("tableOrBreakoutRoom");
        expect(tableOrBreakoutRoom).toBeInTheDocument();
        const requestTime = screen.getByLabelText("requestTime");
        expect(requestTime).toBeInTheDocument();
        const explanation = screen.getByLabelText("explanation");
        expect(explanation).toBeInTheDocument();
        const solved = screen.getByLabelText("solved");
        expect(solved).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(requesterEmail, { target: { value: 'createpage@gmail.com' } })
        fireEvent.change(teamId, { target: { value: 'team_create_page' } })
        fireEvent.change(tableOrBreakoutRoom, { target: { value: 'table' } })
        fireEvent.change(requestTime, { target: { value: '2022-01-02T12:00:00' } })
        fireEvent.change(explanation, { target: { value: 'testing create page for HelpRequest' } })
        fireEvent.change(solved, { target: { value: 'false' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            requesterEmail: "createpage@gmail.com",
            teamId: "team_create_page",
            tableOrBreakoutRoom: "table",
            requestTime: "2022-01-02T12:00",
            explanation: "testing create page for HelpRequest",
            solved: false
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New HelpRequest Created - id: 3 requesterEmail: createpage@gmail.com teamId: team_create_page tableOrBreakoutRoom: table requestTime: 2022-01-02T12:00:00 explanation: testing create page for HelpRequest solved: false");
        expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

    });
});


