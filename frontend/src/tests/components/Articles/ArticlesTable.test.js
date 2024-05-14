import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { articlesFixtures } from "fixtures/articlesFixtures";
import ArticlesTable from "main/components/Articles/ArticlesTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ArticlesTable tests", () => {
  const queryClient = new QueryClient();

  test("Has the expected column headers and content for ordinary user", () => {

    const currentUser = currentUserFixtures.userOnly;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Id", "Title", "URL", "Explanation", "Email", "LocalDateTime"];
    const expectedFields = ["id", "title", "url", "explanation", "email", "localDateTime"];
    const testId = "ArticlesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("CNN");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("cnn.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("this is CNN's homepage");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("c@cnn.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-localDateTime`)).toHaveTextContent("2022-01-02T12:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("BBC");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("bbc.com");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("this is BBC's homepage");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("b@bbc.com");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-localDateTime`)).toHaveTextContent("2022-04-02T12:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-title`)).toHaveTextContent("The New York Times");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-url`)).toHaveTextContent("nytimes.com");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-explanation`)).toHaveTextContent("this is the New York Times' homepage");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-email`)).toHaveTextContent("n@nyt.com");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-localDateTime`)).toHaveTextContent("2022-08-02T12:00:00");

    const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).not.toBeInTheDocument();

    const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).not.toBeInTheDocument();

  });

  test("Has the expected colum headers and content for adminUser", () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    const expectedHeaders = ["Id", "Title", "URL", "Explanation", "Email", "LocalDateTime"];
    const expectedFields = ["id", "title", "url", "explanation", "email", "localDateTime"];
    const testId = "ArticlesTable";

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("CNN");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-url`)).toHaveTextContent("cnn.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-explanation`)).toHaveTextContent("this is CNN's homepage");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-email`)).toHaveTextContent("c@cnn.com");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-localDateTime`)).toHaveTextContent("2022-01-02T12:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-title`)).toHaveTextContent("BBC");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-url`)).toHaveTextContent("bbc.com");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-explanation`)).toHaveTextContent("this is BBC's homepage");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-email`)).toHaveTextContent("b@bbc.com");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-localDateTime`)).toHaveTextContent("2022-04-02T12:00:00");

    expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-title`)).toHaveTextContent("The New York Times");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-url`)).toHaveTextContent("nytimes.com");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-explanation`)).toHaveTextContent("this is the New York Times' homepage");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-email`)).toHaveTextContent("n@nyt.com");
    expect(screen.getByTestId(`${testId}-cell-row-2-col-localDateTime`)).toHaveTextContent("2022-08-02T12:00:00");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const edit2Button = screen.getByTestId(`${testId}-cell-row-1-col-Edit-button`);
    expect(edit2Button).toBeInTheDocument();
    expect(edit2Button).toHaveClass("btn-primary");

    const edit3Button = screen.getByTestId(`${testId}-cell-row-2-col-Edit-button`);
    expect(edit3Button).toBeInTheDocument();
    expect(edit3Button).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass("btn-danger");

    const delete2Button = screen.getByTestId(`${testId}-cell-row-1-col-Delete-button`);
    expect(delete2Button).toBeInTheDocument();
    expect(delete2Button).toHaveClass("btn-danger");

    const delete3Button = screen.getByTestId(`${testId}-cell-row-2-col-Delete-button`);
    expect(delete3Button).toBeInTheDocument();
    expect(delete3Button).toHaveClass("btn-danger");

  });

  test("Edit button navigates to the edit page for admin user", async () => {

    const currentUser = currentUserFixtures.adminUser;

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>

    );

    await waitFor(() => { expect(screen.getByTestId(`ArticlesTable-cell-row-0-col-id`)).toHaveTextContent("2"); });

    const editButton = screen.getByTestId(`ArticlesTable-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    
    fireEvent.click(editButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/articles/edit/2'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesTable articles={articlesFixtures.threeArticles} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const expectedHeaders = ["Id", "Title", "URL", "Explanation", "Email", "LocalDateTime"];
    const expectedFields = ["id", "title", "url", "explanation", "email", "localDateTime"];
    const testId = "ArticlesTable";

    expectedHeaders.forEach((headerText) => {
        const header = screen.getByText(headerText);
        expect(header).toBeInTheDocument();
    });
  
    expectedFields.forEach((field) => {
        const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
        expect(header).toBeInTheDocument();
    });

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-title`)).toHaveTextContent("CNN");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);

  });

});

