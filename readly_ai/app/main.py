#!/usr/bin/env python
# coding: utf-8

# In[15]:

# from fastapi import FastAPI
# import pandas as pd
# import numpy as np
# import faiss
# from pydantic import BaseModel
# from sentence_transformers import SentenceTransformer , util

# embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
# df = pd.read_csv("books.csv",encoding='cp949').fillna(" ")
# sentences = df['D']
# embeddings = embedder.encode(sentences)
# index = faiss.IndexFlatL2(embeddings.shape[1]) # 초기화 : 벡터의 크기를 지정
# index.add(embeddings) # 임베딩을 추가 
# app = FastAPI()

# class InnerObject(BaseModel):
#     foo: int

# class OuterObject(BaseModel):
#     bar: list[InnerObject]


# @app.post("/ai/recommand", response_model=OuterObject)
# async def root(query: str):
#     top_k = 10
#     query_embedding = embedder.encode(query, normalize_embeddings=True ,convert_to_tensor=False)
#     distances, indices = index.search(np.expand_dims(query_embedding,axis=0),top_k)
#     temp = df.iloc[indices[0][0]].BookNum
#     objects = []
#     objects.append(InnerObject(foo=df.iloc[indices[0][0]].BookNum))
#     objects.append(InnerObject(foo=df.iloc[indices[0][1]].BookNum))
#     objects.append(InnerObject(foo=df.iloc[indices[0][2]].BookNum))
#     objects.append(InnerObject(foo=df.iloc[indices[0][3]].BookNum))
#     objects.append(InnerObject(foo=df.iloc[indices[0][4]].BookNum))
#     objects.append(InnerObject(foo=df.iloc[indices[0][5]].BookNum))
#     return OuterObject(bar=objects)


# In[ ]:





# In[ ]:

from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer

# 모델 및 데이터 로딩
embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
df = pd.read_csv("books.csv", encoding='cp949').fillna(" ")
sentences = df['D']
embeddings = embedder.encode(sentences)
index = faiss.IndexFlatL2(embeddings.shape[1])  # 벡터의 크기 지정
index.add(embeddings)  # 임베딩 추가

app = FastAPI()

# Pydantic 모델 정의
class QueryRequest(BaseModel):
    query: str

class InnerObject(BaseModel):
    foo: int

class OuterObject(BaseModel):
    bar: list[InnerObject]

# POST 엔드포인트 정의
@app.post("/ai/recommand", response_model=OuterObject)
async def recommend(request: QueryRequest):
    query = request.query
    top_k = 10
    query_embedding = embedder.encode(query, normalize_embeddings=True, convert_to_tensor=False)
    distances, indices = index.search(np.expand_dims(query_embedding, axis=0), top_k)
    objects = [InnerObject(foo=df.iloc[indices[0][i]].BookNum) for i in range(top_k)]
    return OuterObject(bar=objects)




# In[ ]:

