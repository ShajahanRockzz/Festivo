import { Mycompetitions } from './Participant/mycompetitions/mycompetitions';
import { About } from './Guest/about/about';
import { ParticipantAbout } from './Participant/about/about';
import { ParticipantContact } from './Participant/contact/contact';
import { Myregistrations } from './Participant/myregistrations/myregistrations';
import { Registrationdetails } from './Participant/registrationdetails/registrationdetails';
import { Contact } from './Guest/contact/contact';
import { Viewallfestsguest } from './Guest/viewallfestsguest/viewallfestsguest';
import { Routes } from '@angular/router';
import { Guestmaster } from './Guest/guestmaster/guestmaster';
import { Guesthome } from './Guest/guesthome/guesthome';
import { Registerparticipant } from './Guest/registerparticipant/registerparticipant';
import { Registerinstitution } from './Guest/registerinstitution/registerinstitution';
import { Festdetailsguest } from './Guest/festdetailsguest/festdetailsguest';
import { Login } from './Guest/login/login';
import { Adminmaster } from './Admin/adminmaster/adminmaster';
import { Adminhome } from './Admin/adminhome/adminhome';
import { Addcategory } from './Admin/addcategory/addcategory';
import { Viewcategory } from './Admin/viewcategory/viewcategory';
import { Editcategory } from './Admin/editcategory/editcategory';
import { Createplan } from './Admin/createplan/createplan';
import { Viewplan } from './Admin/viewplan/viewplan';
import { Editplan } from './Admin/editplan/editplan';
import { Viewallusers } from './Admin/viewallusers/viewallusers';
import { Coordinatormaster } from './Coordinator/coordinatormaster/coordinatormaster';
import { Coordinatorhome } from './Coordinator/coordinatorhome/coordinatorhome';
import { Viewassignedfests } from './Coordinator/viewassignedfests/viewassignedfests';
import { Viewfestcompetitions } from './Coordinator/viewfestcompetitions/viewfestcompetitions';
import { Festparticipant } from './Coordinator/festparticipant/festparticipant';
import { Participantmaster } from './Participant/participantmaster/participantmaster';
import { Participanthome } from './Participant/participanthome/participanthome';
import { Viewallfests } from './Participant/viewallfests/viewallfests';
import { Festdetailsparticipant } from './Participant/festdetailsparticipant/festdetailsparticipant';
import { Registercompetition } from './Participant/registercompetition/registercompetition';
import { Viewcompetitindetailsparticiapant } from './Participant/viewcompetitindetailsparticiapant/viewcompetitindetailsparticiapant';
import { Institutionmaster } from './Institution/institutionmaster/institutionmaster';
import { Institutionhome } from './Institution/institutionhome/institutionhome';
import { Createfest } from './Institution/createfest/createfest';
import { Editfest } from './Institution/editfest/editfest';
import { Viewfest } from './Institution/viewfest/viewfest';
import { Buyplan } from './Institution/buyplan/buyplan';
import { Festdetails } from './Institution/festdetails/festdetails';
import { Upgradeplan } from './Institution/upgradeplan/upgradeplan';
import { Createcompetition } from './Institution/createcompetition/createcompetition';
import { Editcompetition } from './Institution/editcompetition/editcompetition';
import { Viewcompetitions } from './Institution/viewcompetitions/viewcompetitions';
import { Viewresult } from './Institution/viewresult/viewresult';
import { Selectfest } from './Institution/selectfest/selectfest';
import { Editresult } from './Institution/editresult/editresult';
import { Festpreview } from './Institution/festpreview/festpreview';
import { Addcoordinator } from './Institution/addcoordinator/addcoordinator';
import { Viewcoordinators } from './Institution/viewcoordinators/viewcoordinators';
import { Assigncoordinator } from './Institution/assigncoordinator/assigncoordinator';
import { Studentparticipationreport } from './Institution/studentparticipationreport/studentparticipationreport';
import { Festrevenuereport } from './Institution/festrevenuereport/festrevenuereport';
import { Prizereport } from './Institution/prizereport/prizereport';
import { Competitionsdetails } from './Institution/competitionsdetails/competitionsdetails';
import { Festpreview as CoordinatorFestpreview } from './Coordinator/festpreview/festpreview';
import { Competitiondetails } from './Coordinator/competitiondetails/competitiondetails';
import { Totalrevenue } from './Admin/totalrevenue/totalrevenue';
import { Guestmessage } from './Admin/guestmessage/guestmessage';
import { Adminrevenue } from './Admin/adminrevenue/adminrevenue';

export const routes: Routes = [
    {path: '', redirectTo: 'guestmaster/guesthome', pathMatch: 'full'},
    {path: 'login', component: Login},
    {
        path: 'guestmaster', component: Guestmaster,
        children: [
            {path: 'guesthome', component: Guesthome},
            {path: 'registerparticipant', component: Registerparticipant},
            {path: 'registerinstitution', component: Registerinstitution},
            {path: 'viewallfestsguest', component: Viewallfestsguest},
            {path: 'festdetailsguest/:id', component: Festdetailsguest},
            {path: 'about', component: About},
            {path: 'contact', component: Contact}
        ]
    },
    {
        path: 'adminmaster', component: Adminmaster,
        children: [
            {path: 'adminhome', component: Adminhome},
            {path: 'addcategory', component: Addcategory},
            {path: 'viewcategory', component: Viewcategory},
            {path: 'editcategory/:categoryId', component: Editcategory},
            {path: 'createplan', component: Createplan},
            {path: 'viewplan', component: Viewplan},
            {path: 'editplan/:planId', component: Editplan},
            {path: 'viewallusers', component: Viewallusers},
            {path: 'totalrevenue', component: Totalrevenue},
            {path: 'adminrevenue', component: Adminrevenue},
            {path: 'guestmessage', component: Guestmessage} // Placeholder for future admin-specific revenue page
        ]
    },
    {
        path: 'Institution', component: Institutionmaster,
        children: [
           {path: 'home', component: Institutionhome},
           {path: 'createfest', component: Createfest},
          {path: 'editfest/:id', component: Editfest},
           {path: 'viewfest', component: Viewfest},
           {path: 'festdetails/:id', component: Festdetails},
           {path: 'festpreview/:id', component: Festpreview},
           {path: 'selectfest', component: Selectfest},
           {path: 'createcompetition', component: Createcompetition},
           {path: 'editcompetition', component: Editcompetition},
           {path: 'viewcompetitions/:festId', component: Viewcompetitions},
           {path: 'editresult', component: Editresult},
           {path: 'viewresult', component: Viewresult},
           {path: 'buyplan', component: Buyplan},
           {path: 'upgradeplan', component: Upgradeplan},
           {path: 'addcoordinator', component: Addcoordinator},
           {path: 'viewcoordinators', component: Viewcoordinators},
           {path: 'assigncoordinator', component: Assigncoordinator},
           {path: 'studentparticipationreport', component: Studentparticipationreport},
           {path: 'festrevenuereport', component: Festrevenuereport},
           {path: 'prizereport', component: Prizereport},
           {path: 'competitionsdetails/:id', component: Competitionsdetails}
        ]
    },
    {
        path: 'coordinatormaster', component: Coordinatormaster,
        children: [
            {path: '', redirectTo: 'viewassignedfests', pathMatch: 'full'},
            {path: 'coordinatorhome', component: Coordinatorhome},
            {path: 'viewassignedfests', component: Viewassignedfests},
            {path: 'viewfestcompetitions/:festId', component: Viewfestcompetitions},
            {path: 'festparticipant/:competitionId/:festId', component: Festparticipant},
            {path: 'festpreview/:festId', component: CoordinatorFestpreview},
            {path: 'competitiondetails/:competitionId/:festId', component: Competitiondetails}
        ]
    },
    {
        path: 'participantmaster', component: Participantmaster,
        children: [
            {path: 'participanthome', component: Participanthome},
            {path: 'viewallfests', component: Viewallfests},
            {path: 'festdetailsparticipant/:id', component: Festdetailsparticipant},
            {path: 'registercompetition/:id', component: Registercompetition},
            {path: 'viewcompetitindetailsparticiapant/:id', component: Viewcompetitindetailsparticiapant},
            {path: 'about', component: ParticipantAbout},
            {path: 'contact', component: ParticipantContact},
            {path: 'myregistrations', component: Myregistrations},
            {path: 'registrationdetails/:id', component: Registrationdetails},
            {path: 'mycompetitions', component: Mycompetitions}
        ]
    }
];



