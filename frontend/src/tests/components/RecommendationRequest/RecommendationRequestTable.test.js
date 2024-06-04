import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { recommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import RecommendationRequestTable from "main/components/RecommendationRequest/RecommendationRequestTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "id",
    "RequesterEmail",
    "ProfessorEmail",
    "Explanation",
    "DateRequested",
    "DateNeeded",
    "Done",
  ];
  const expectedFields = [
    "id",
    "requesterEmail",
    "professorEmail",
    "explanation",
    "dateRequested",
    "dateNeeded",
    "Done",
  ];
  const testId = "RecommendationRequestTable";

  test("renders empty table correctly", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            recommendationRequests={[]}
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(
        `${testId}-cell-row-0-col-${field}`
      );
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            recommendationRequests={
              recommendationRequestFixtures.threeRecommendationRequests
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`)
    ).toHaveTextContent("student1@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-professorEmail`)
    ).toHaveTextContent("professor1@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`)
    ).toHaveTextContent("explanation1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateRequested`)
    ).toHaveTextContent("2025-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateNeeded`)
    ).toHaveTextContent("2025-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Done`)
    ).toHaveTextContent("true");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`)
    ).toHaveTextContent("student2@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-professorEmail`)
    ).toHaveTextContent("professor2@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-explanation`)
    ).toHaveTextContent("explanation2");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateRequested`)
    ).toHaveTextContent("2026-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateNeeded`)
    ).toHaveTextContent("2026-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-Done`)
    ).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "4"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-requesterEmail`)
    ).toHaveTextContent("student3@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-professorEmail`)
    ).toHaveTextContent("professor3@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-explanation`)
    ).toHaveTextContent("explanation3");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-dateRequested`)
    ).toHaveTextContent("2027-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-dateNeeded`)
    ).toHaveTextContent("2027-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-Done`)
    ).toHaveTextContent("false");

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

  test("Has the expected column headers, content for ordinary user", () => {
    // arrange
    const currentUser = currentUserFixtures.userOnly;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            recommendationRequests={
              recommendationRequestFixtures.threeRecommendationRequests
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent(
      "2"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`)
    ).toHaveTextContent("student1@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-professorEmail`)
    ).toHaveTextContent("professor1@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-explanation`)
    ).toHaveTextContent("explanation1");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateRequested`)
    ).toHaveTextContent("2025-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-dateNeeded`)
    ).toHaveTextContent("2025-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-Done`)
    ).toHaveTextContent("true");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent(
      "3"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-requesterEmail`)
    ).toHaveTextContent("student2@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-professorEmail`)
    ).toHaveTextContent("professor2@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-explanation`)
    ).toHaveTextContent("explanation2");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateRequested`)
    ).toHaveTextContent("2026-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-dateNeeded`)
    ).toHaveTextContent("2026-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-1-col-Done`)
    ).toHaveTextContent("false");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent(
      "4"
    );
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-requesterEmail`)
    ).toHaveTextContent("student3@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-professorEmail`)
    ).toHaveTextContent("professor3@ucsb.edu");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-explanation`)
    ).toHaveTextContent("explanation3");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-dateRequested`)
    ).toHaveTextContent("2027-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-dateNeeded`)
    ).toHaveTextContent("2027-05-09T23:19:21.971Z");
    expect(
      screen.getByTestId(`${testId}-cell-row-2-col-Done`)
    ).toHaveTextContent("false");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            recommendationRequests={
              recommendationRequestFixtures.threeRecommendationRequests
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`)
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`)
    ).toHaveTextContent("student1@ucsb.edu");

    const editButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Edit-button`
    );
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() =>
      expect(mockedNavigate).toHaveBeenCalledWith(
        "/recommendationrequest/edit/2"
      )
    );
  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestTable
            recommendationRequests={
              recommendationRequestFixtures.threeRecommendationRequests
            }
            currentUser={currentUser}
          />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(
      await screen.findByTestId(`${testId}-cell-row-0-col-id`)
    ).toHaveTextContent("2");
    expect(
      screen.getByTestId(`${testId}-cell-row-0-col-requesterEmail`)
    ).toHaveTextContent("student1@ucsb.edu");

    const deleteButton = screen.getByTestId(
      `${testId}-cell-row-0-col-Delete-button`
    );
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });
});