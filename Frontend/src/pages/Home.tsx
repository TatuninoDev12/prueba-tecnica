import { useNasaData } from "@/hook/useNasaData";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import styled from "styled-components";

const Home = () => {
  const queryClient = useQueryClient();
  const [deletedId, setDeletedId] = useState < Set < number | null >> (new Set());
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
  const allPhotosFiltered = allPhotos.filter(
    (photo) => !deletedId.has(photo.id)
  );

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      setTimeout(() => fetchNextPage(), 500); // Delay de 500ms
    }
  };

  const handleDelete = (id) => {
    setDeletedId((prev) => new Set([...prev, id]));

    queryClient.setQueryData(["photos"], (oldData) => ({
      pages: oldData.pages.map((page) => ({
        ...page,
        photos: page.photos.filter((photo) => photo.id !== id),
      })),
      pageParams: oldData.pageParams,
    }));
  };

  if (isLoading) return <Loader>Loading initial photos...</Loader>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Container>
      <h1>Mars Rover Photos</h1>
      <PhotoGrid>
        {allPhotosFiltered.map((photo) => (
          <article key={photo.id} className="photo-card">
            <button
              className="delete-btn"
              onClick={() => handleDelete(photo.id)}
              aria-label="Delete photo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
              >
                <path
                  fill="currentColor"
                  d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v7H9v-7zm4 0h2v7h-2v-7zM9 4v2h6V4H9z"
                />
              </svg>
            </button>
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

const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
  color: #000;
  font-weight: bold;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const Container = styled.div`
  width: min(100% - 3rem, 1440px);
  margin-inline: auto;

  .photo-card {
    background: #f5ebe0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 3px 0px 1px rgb(219, 210, 199);
    transition: transform 0.3s ease;
    position: relative;
    &:hover {
      transform: scale(1.02);
    }
    .photo-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .delete-btn {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: rgba(255, 77, 79, 0.9);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      transition: background 0.2s ease, transform 0.2s ease;
      z-index: 10;
      box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.51);
      &:hover {
        background: #ff4d4f;
        transform: scale(1.1);
      }

      svg {
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
      }
    }
  }

  .photo-meta {
    padding: 12px;
    display: flex;
    justify-content: space-between;
    font-size: 0.9em;
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
  font-size: 0.9rem;
  position: relative;

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
    box-shadow: 0 3px 0px 1px rgb(219, 210, 199);
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    max-width: 300px;
  }

  .load-more-btn:disabled {
    background: rgb(219, 210, 199);
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

const SpanStatus = styled.span`
  color: ${(props) => (props.status === "active" ? "green" : "red")};
  font-weight: bold;
  font-size: 0.9rem;
  position: relative;
  diplay: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-transform: capitalize;
  border-radius: 15px;
  border: 1px dashed ${(props) => (props.status === "active" ? "green" : "red")};
  padding: 2px 5px;
  width: 100px;
  margin: 0 auto;
  &:hover {
    background-color: ${(props) =>
    props.status === "active" ? "#d4edda" : "#f8d7da"};
  }
  transition: background-color 0.3s ease;
`;

export default Home;
