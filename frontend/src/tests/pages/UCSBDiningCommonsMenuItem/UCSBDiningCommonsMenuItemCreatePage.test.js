import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemCreatePage from "main/pages/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemCreatePage";
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

describe("UCSBDiningCommonsMenuItemCreatePage tests", () => {

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
                <UCSBDiningCommonsMenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /ucsbdiningcommonsmenuitem", async () => {

        const queryClient = new QueryClient();
        const ucsbDiningCommonsMenuItem = {
            id: 3,
            diningCommonsCode: "Carrillo",
            name: "Blueberry Muffin",
            station: "Bakery"
        };

        axiosMock.onPost("/api/ucsbdiningcommonsmenuitem/post").reply(202, ucsbDiningCommonsMenuItem);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuItemCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Name")).toBeInTheDocument();
        });

        const codeInput = screen.getByLabelText("Dining Commons Code");
        expect(codeInput).toBeInTheDocument();

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const stationInput = screen.getByLabelText("Station");
        expect(stationInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(codeInput, { target: { value: 'Carrillo' } });
        fireEvent.change(nameInput, { target: { value: 'Blueberry Muffin' } });
        fireEvent.change(stationInput, { target: { value: 'Bakery' } });
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            name: "Blueberry Muffin",
            diningCommonsCode: "Carrillo",
            station: "Bakery",
        });

        // assert - check that the toast was called with the expected message
        expect(mockToast).toBeCalledWith("New ucsbDiningCommonsMenuItem Created - id: 3 diningCommonsCode: Carrillo name: Blueberry Muffin station: Bakery");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenuitem" });

    });
});


