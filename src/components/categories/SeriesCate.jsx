import React, { useState, useEffect } from "react";
import axios from "axios"; // axios 라이브러리 임포트
import '../../assets/styleSheet.css';

function SeriesCate() {
    // 카테고리 상태 관리
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [editCategoryId, setEditCategoryId] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");

    // 카테고리 조회 (GET)
    useEffect(() => {
        axios.get('/api/categories/series/list') // endpoint를 변경
            .then(response => setCategories(response.data))
            .catch(error => console.error('Error fetching categories:', error));
    }, []);

    // 새 카테고리 추가 (POST)
    const handleAddCategory = () => {
        const category = { name: newCategory };
        axios.post('/api/categories/series/add', category) // endpoint를 변경
            .then(response => {
                setCategories([...categories, response.data]); // 상태에 새 카테고리 추가
                setNewCategory(""); // 입력값 초기화
            })
            .catch(error => console.error('Error adding category:', error));
    };

    // 카테고리 수정 (PUT)
    const handleEditCategory = (id) => {
        const updatedCategory = { name: editCategoryName };

        // 디버깅용 로그
        console.log("수정할 카테고리 id: ", id);
        console.log("수정할 카테고리 이름: ", updatedCategory.name);

        axios.put(`/api/categories/series/update/${id}`, updatedCategory) // endpoint를 변경
            .then(response => {
                setCategories(categories.map(category => 
                    category.seriesCategoryId === id ? response.data : category // 변경된 필드 이름에 맞춤
                ));
                setEditCategoryId(null); // 수정 모드 종료
                setEditCategoryName(""); // 입력값 초기화
            })
            .catch(error => console.error('Error updating category:', error));
    };

    // 카테고리 삭제 (DELETE)
    const handleDeleteCategory = (id) => {
        axios.delete(`/api/categories/series/delete/${id}`) // endpoint를 변경
            .then(() => {
                setCategories(categories.filter(category => category.seriesCategoryId !== id)); // 변경된 필드 이름에 맞춤
            })
            .catch(error => console.error('Error deleting category:', error));
    };

    return (
        <div className='main-div flex flex-col gap-3 max-w-screen-sm w-full mx-auto md:px-9 md:border-x md:border-x-gray-100'>
            <div className="mb-4 flex flex-col gap-1.5 pt-3">
            <strong className="text-lg text-black font-bold md:text-xl justify-start">시리즈 카테고리 관리</strong>
            </div>
            {/* 카테고리 추가 */}
            <div className="gap-4">
                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="새 카테고리 이름"
                /> 
                <button onClick={handleAddCategory}>추가</button>
            </div>
            <hr className="divider"></hr>
            {/* 카테고리 리스트 */}
            <table>
    <thead>
        <tr>
            <th>카테고리 이름</th>
            <th>편집/삭제</th>
        </tr>
    </thead>
    <tbody>
        {categories.length === 0 ? (
            <tr>
                <td colSpan="2">카테고리가 없습니다</td>
            </tr>
        ) : (
            categories.map((category) => (
                <tr key={category.seriesCategoryId}>
                    <td>
                        {editCategoryId === category.seriesCategoryId ? (
                            <input
                                type="text"
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                            />
                        ) : (
                            <span>{category.name}</span>
                        )}
                    </td>
                    <td>
                        {editCategoryId === category.seriesCategoryId ? ( 
                            <>
                                <button onClick={() => handleEditCategory(category.seriesCategoryId)}>저장</button>
                                <button onClick={() => setEditCategoryId(null)}>취소</button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    setEditCategoryId(category.seriesCategoryId); 
                                    setEditCategoryName(category.name);
                                }}
                            >
                                편집
                            </button>
                        )}
                        <button onClick={() => handleDeleteCategory(category.seriesCategoryId)}>삭제</button> {/* 변경된 필드 이름에 맞춤 */}
                    </td>
                </tr>
            ))
        )}
    </tbody>
</table>

        </div>
    );
}

export default SeriesCate;
