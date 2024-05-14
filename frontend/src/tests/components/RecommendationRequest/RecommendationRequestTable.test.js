import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { onDeleteSuccess } from "main/utils/RecommendationRequestUtils";
import { toast } from "react-toastify";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UserTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {
    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = [
      "id",
      "Requester Email",
      "Professor Email",
      "Explanation",
      "Date Requested",
      "Date Needed",
      "Done",
    ];
    const expectedFields = [
      "id",
      "requesterEmail",
      "professorEmail",
      "explanation",
      "dateRequested",
      "dateNeeded",
    ];
    const testId = "RecommendationRequestTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1"
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2"
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Done`)
    ).toHaveTextContent("Yes");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-Done`)
    ).toHaveTextContent("No");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-Done`)
    ).toHaveTextContent("No");

    const editButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Edit-button`
    );
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(
      `${testId}-cell-row-0-col-Delete-button`
    );
    expect(deleteButton).not.toBeInTheDocument();
  });

  test("Has the expected colum headers and content for adminUser", () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = [
      "id",
      "Requester Email",
      "Professor Email",
      "Explanation",
      "Date Requested",
      "Date Needed",
      "Done",
    ];
    const expectedFields = [
      "id",
      "requesterEmail",
      "professorEmail",
      "explanation",
      "dateRequested",
      "dateNeeded",
    ];

    const testId = "RecommendationRequestTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "1"
    );
    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "2"
    );
    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "3"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Done`)
    ).toHaveTextContent("Yes");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-Done`)
    ).toHaveTextContent("No");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-Done`)
    ).toHaveTextContent("No");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`
    );
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`
    );
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");
  });

  test("Edit button navigates to the edit page for admin user", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-id`)
      ).toHaveTextContent("1");
    });

    const editButton = screen.getByTestId(
      `RecommendationRequestTable-cell-row-0-col-Edit-button`
    );
    expect(editButton).toBeInTheDocument();

    fireEvent.click(editButton);

    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/recommendationrequest/edit/1"
      )
    );
  });

  test("Delete button calls delete callback", async () => {
    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            requests={recommendationRequestFixtures.threeRequests}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    await waitFor(() => {
      expect(
        screen.getByTestId(`RecommendationRequestTable-cell-row-0-col-id`)
      ).toHaveTextContent("1");
    });

    const deleteButton = screen.getByTestId(
      `RecommendationRequestTable-cell-row-0-col-Delete-button`
    );
    expect(deleteButton).toBeInTheDocument();

    fireEvent.click(deleteButton);
  });
});

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

describe("onDeleteSuccess", () => {
  it("logs the message and displays a toast", () => {
    console.log = jest.fn();

    const message = "Test message";
    onDeleteSuccess(message);

    expect(console.log).toHaveBeenCalledWith(message);
    expect(toast).toHaveBeenCalledWith(message);
  });
});
