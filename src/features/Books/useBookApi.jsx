import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useAuthContext } from '../Auth/AuthContext';

const relatedEntities = {
  authors: [],
};

const getRelated = structuredClone(relatedEntities);

export function useBookApi(id, shouldRequestOnLoad = true) {
  const [data, setData] = useState(null);
  const [related, setRelated] = useState(structuredClone(relatedEntities));
  const { accessToken } = useAuthContext();

  const { get: getBooks, remove, post, patch } = useApi('books');
  ({ get: getRelated.authors } = useApi('authors'));

  const getBook = useCallback(async () => {
    const data = await getBooks(null, id);
    setData(data);

    if (id) {
      const promises = structuredClone(relatedEntities);
      for (const entity in relatedEntities) {
        if (data[entity]?.length) {
          for (const entityId of data[entity]) {
            promises[entity].push(getRelated[entity](null, entityId));
          }
        }
      }

      const newRelated = {};
      for (const entity in relatedEntities) {
        const data = await Promise.all(promises[entity]);
        newRelated[entity] = data;
      }
      setRelated(newRelated);
    }
    return data;
  }, [id, getBooks]);

  useEffect(() => {
    if (shouldRequestOnLoad) {
      getBook();
    }
  }, [shouldRequestOnLoad, getBook]);

  function deleteBook() {
    return remove(id, { accessToken });
  }

  function addBook(body) {
    return post(body, { accessToken });
  }

  function updateBook(body) {
    console.log(body);
    return patch(id, body, { accessToken });
  }
  return { data, related, deleteBook, addBook, updateBook, getBook };
}