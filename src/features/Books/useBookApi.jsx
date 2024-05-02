import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useAuthContext } from '../Auth/AuthContext';

const relatedEntities = {
  authors: [],
  categories: []
};

const getRelated = structuredClone(relatedEntities);

export function useBookApi(id, shouldRequestOnLoad = true) {
  const [data, setData] = useState(null);
  const [related, setRelated] = useState(structuredClone(relatedEntities));
  const { accessToken } = useAuthContext();
  console.log("accessToken:", accessToken)

  const { get: getBooks, remove, post, patch } = useApi('books');
  ({ get: getRelated.authors } = useApi('authors'));
  ({ get: getRelated.categories } = useApi('categories'));

  const getBook = useCallback(async () => {
    const data = await getBooks(null, id, {accessToken});
    setData(data);

    if (id) {
      const promises = structuredClone(relatedEntities);
      console.log("rel:", relatedEntities)
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
    return patch(id, body, { accessToken });
  }
  return { data, related, deleteBook, addBook, updateBook, getBook };
}