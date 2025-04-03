import { useNasaData } from "@/hook/useNasaData";
import styled from "styled-components";

interface SpanStatusProps {
  status: string;
}

const Home = () => {
  // const { currentPage } = usePaginationStore()
  const {
    isLoading,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useNasaData(1, 12);

  const allPhotos = data?.pages.flatMap((page) => page.photos) || [];

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      setTimeout(() => fetchNextPage(), 500); // Delay de 500ms
    }
  };

  if (isLoading) return <div>Loading initial photos...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Container>
      <h1>Mars Rover Photos</h1>
      <PhotoGrid>
        {allPhotos.map((photo) => (
          <article key={photo.id} className="photo-card">
            <img
              src={photo.img_src}
              alt={`Mars - ${photo.camera.full_name}`}
              className="photo-image"
              loading="lazy"
            />
            <div className="photo-meta">
              <span>
                <strong>ID:</strong> {photo.id}
              </span>
              <span>
                <strong>Camara: </strong>
                {photo.camera.name}
              </span>
              <span>
                <strong>Rover:</strong> {photo.rover.name}
              </span>
              <span>
                <strong>Sol:</strong> {photo.sol}
              </span>
              <span>
                <strong>Earth Date:</strong> {photo.earth_date}
              </span>
              <SpanStatus status={photo.rover.status}>
                {photo.rover.status}
              </SpanStatus>
            </div>
          </article>
        ))}
      </PhotoGrid>

      {hasNextPage && (
        <LoadMoreButton>
          <button
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
            className="load-more-btn"
          >
            {isFetchingNextPage ? "Loading..." : "More Images"}
          </button>
        </LoadMoreButton>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: min(100% - 3rem, 1440px);
  margin-inline: auto;

  .photo-card {
    background: #f5ebe0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 3px 0px 1px rgb(219, 210, 199);
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.02);
    }
    .photo-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
  }

  .photo-meta {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 0.8em;
    color: #000;
    flex-direction: column;
    gap: 0.5rem;
    font-size: clamp(0.8rem, 2vw, 0.9rem);
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(280px, 1fr));
  gap: 1.5rem;

  margin-bottom: 2rem;
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(280px, 1fr));
    gap: 1.5rem;
    .photo-image {
      height: 200px;
    }
  }
  @media (max-width: 946px) {
    grid-template-columns: repeat(2, minmax(280px, 1fr));
    gap: 1rem;

    .photo-image {
      height: 180px;
    }
  }
  @media (max-width: 628px) {
    grid-template-columns: repeat(1, minmax(280px, 1fr));
    gap: 1rem;

    .photo-image {
      height: 150px;
    }
  }
`;

const LoadMoreButton = styled.div`
  text-align: center;
  margin: 2rem 0;

  .load-more-btn {
    background: #f5ebe0;
    color: #000;
    border: none;
    padding: 1rem 2.5rem;
    border-radius: 30px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 300px;
  }

  .load-more-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }

  .load-more-btn:hover:not(:disabled) {
    background: rgb(219, 210, 199);
  }
  @media (max-width: 768px) {
    .load-more-btn {
      padding: 0.8rem 2rem;
      font-size: 0.9rem;
    }
  }

  @media (max-width: 480px) {
    .load-more-btn {
      width: 90%;
      max-width: none;
    }
  }
`;

const SpanStatus = styled.span<SpanStatusProps>`
  color: ${(props) => (props.status === "active" ? "green" : "red")};
  font-weight: bold;
  font-size: 0.9em;
  position: relative;
  diplay: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-transform: capitalize;
  border-radius: 15px;
  border: 1px dashed ${(props) => (props.status === "active" ? "green" : "red")};
  padding: 2px 5px;
  &:hover {
    background-color: ${(props) =>
      props.status === "active" ? "#d4edda" : "#f8d7da"};
  }
  transition: background-color 0.3s ease;
`;

export default Home;
