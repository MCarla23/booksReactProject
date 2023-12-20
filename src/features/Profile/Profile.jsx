import Container from "../../components/Container/Container";
import { useAuthContext } from "../Auth/AuthContext";
import './Profile.css'
import {CiEdit} from "react-icons/ci";
import { MdDownloadDone } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { useState } from "react";
import { useApi } from "../../hooks/useApi";
import { useEffect } from "react";

function CategoryLabel({display, type, value, onChangeUser, defUser}){
    const [edit, setEdit] = useState(false);

    return (<>
        <div className="category-label">
            <h3>{display}:</h3>

            {edit === false &&
                <>
                    <p>{value}</p>
                    <CiEdit onClick={() => {
                        setEdit(!edit);
                    }}/>
                </>
                
            }
            {edit === true &&
                <>
                    <input type='text' defaultValue={value} onInput={(e) => {
                        onChangeUser((oldUser) => {
                            return {...oldUser, [type]: e.target.value}
                        })
                    }}/>
                    <MdCancel onClick={ () => {
                        setEdit(!edit);
                        onChangeUser((oldUser) => {
                            return {...oldUser, [type]: defUser[type]}
                        })
                    }}/>
                </>
                
            }
        </div>
        
        <hr />
    </>);
}

export function Profile(){
    const {user, accessToken, logout} = useAuthContext();
    const [currentUser, setCurrentUser] = useState(user);
    const {patch} = useApi('users');
    const obiectul = useAuthContext();
    console.log(obiectul);


    async function handleSaveChanges(){
        patch(user.id, currentUser, { accessToken });
        logout();
    }

    return (<Container>
        <h1>Account</h1>
        <h2>-manage your account settings-</h2>
        <CategoryLabel display='First Name' type='firstName' value={user?.firstName} onChangeUser={setCurrentUser} defUser={user}/>
        <CategoryLabel display='Last Name' type='lastName' value={user?.lastName} onChangeUser={setCurrentUser} defUser={user}/>
        <CategoryLabel display='Email' type='email' value={user?.email} onChangeUser={setCurrentUser} defUser={user}/>

        { (user.firstName != currentUser.firstName || user.lastName != currentUser.lastName || user.email != currentUser.email) &&
            <button className="btn" onClick={handleSaveChanges}>Save Changes</button>
        }
    </Container>);
}