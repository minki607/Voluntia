
# Deliverable 4
  

![Volunteer Across](https://lh3.googleusercontent.com/ShUHlPwkTzrn1GvYmLzMWQKuYpEcJZApCLZovFuXYAtCpXh39Zsqa3c73TGDgvlPf2fBV1hGfZu1)

 
*Voluntia* is a volunteering event booking website which allows volunteers to register and participate in various volunteering activities across Victoria.

  
***For optimum testing you're advised to create both Volunteer and Organization account***
*Invitational code required for Organization Signup has been disabled to allow easy testing*

 
We have three main functionalities for the website:

  

## 1. Login/Sign up

  
We have two Sign up options i.e. the user can sign in as a volunteer or as an organisation.

 
Event organizers can login as an organizer in order to create events and also authenticate incoming requests for volunteering.

 
Volunteers can register and login to view the events and register themselves for volunteering activities.

  
[Sign Up Option Page](https://voluntia.herokuapp.com/signup)

 1. [x] Signup as Volunteer - (https://voluntia.herokuapp.com/volunteer/signup)
 2. [x] Signup as Organization - (https://voluntia.herokuapp.com/organization/signup)
 

  

Steps for Sign Up:

  

1. Click on signup button present on rightmost corner of navigation bar

  

2. Enter details like name, email and password

  

3. Click on register button

  
  

Steps for Login:

Login - (https://voluntia.herokuapp.com/organization/login)

  

- Click on login button present on rightmost corner of navigation bar

  

- Enter email and password that was entered during signup stage

  

- Click on login button

  

- On successful login you will be redirected to the dashboard(volunteer) dashboardadmin(organization)

  

**List of files:**

  


 

- Routes: `/signup , /volunteer/signup , /organization/signup, /login , /logout`

- Views: `login.pug, sign_option.pug, signupuser.pug, signuporganization.pug, dashboard.pug, dashboardadmin.pug, error.pug`

- Controllers: `controller.js`
 (getSignup, getUserSignup, getOrganizationSignup, userSignup, organizationSignup, login)

- Models: `organization.js, user.js, event.js, db.js`

## 2. Browse event


Volunteers/Organization can browse events through their respective dashboards.

Once signed in, access view event page through the sidebar or the link below.

[Event List](https://voluntia.herokuapp.com/event/list)	

Steps for Browsing 
1. Use pagination to navigate through events (Max 6 events per page)
2. To find specific event, search keywords using the search bar located on top of the side bar (name, type)
3. View filtered event list

- Routes: `/search, /event/list/:post?'`

- Views: `all_event.pug`

- Controllers: `controller.js`
   getEvent, listEvent, paginate

- Models: `event.js`
  

## 3. Register for an event

  

Volunteers can browse the events and then register themselves for the events that they want to volunteer for.

  

*You need to login as a **volunteer** in order to register for an event.*

  

[Login As Volunteer](https://voluntia.herokuapp.com/dashboard)

  

Steps for Booking:

  

1. Access event list through the sidebar in dashboard and press each event to view in detail
 - [x] View All avaliable Events - (https://voluntia.herokuapp.com/event/list)
 - [x] View Selected Event - (https://voluntia.herokuapp.com/event/:id)

2. Click on “Book now” button to register.
3. You will be redirected to the dashboard.
4. The event will be then added to the pending list of events.

  

 - [x] View Pending Event - (https://voluntia.herokuapp.com/pending/requests)

5. Once the Organization that created the event  accept the request from their side the booking is completed 	

7. You can now see the event in confirmed events/rejected event/completed list if approved, rejected or marked completed by organization respectively. For confirmed events you can directly view them in the main dashboard for quick reminder.

  

 - [x] View Confirmed Events - (https://voluntia.herokuapp.com/request/accepted)
 - [x] View Rejected Events - (https://voluntia.herokuapp.com/request/rejected)
 - [x] View Completed Events -(https://voluntia.herokuapp.com/request/completed)


  

**List of files:**


- Routes: `/event/:id , /event/booking, /pending/requests, /booked/requests, /request/:id/:userId,/request/accepted, /request/completed, /request/completed, /request/rejected, /event/accepted/organization,/event/completed/organization, /event/rejected/organization`

- Views: `all_event.pug, approve_request.pug, pending_request.pug, selected_event.pug`

- Controllers: `eventController.js`
 bookEvents, pendingRequest, bookedRequests, pendingRequestInfo, requestResponse, fetchConfirmedEvents, fetchCompletedEvents, fetchRejectedEvents, requestResponse, , fetchConfirmedOrgnaization, fetchRejectedEventOrganization

- Models: `request.js`

## 4. Manage an event

  

Organizers can create an event and authenticate participation requests from volunteers.

*you need to login as an **Organisation** in order to create an event.

[Login as Organizer](https://voluntia.herokuapp.com/dashboardadmin)

  
Steps for Event creation:

  

1. Go to the organisation dashboard.
	 - [x] Dashboard Admin - (https://voluntia.herokuapp.com/dashboardadmin)



  

2. Click on “Manage events”

 

	 - [x] Manage Event - (https://voluntia.herokuapp.com/event/list)


* the content of `/event/list` will be different according to the user account (whether signed in as volunteer or org)

* Here you'll see event only created by the currently logged in organization

 
3. click “add event” button just below the sidebar.

	 - [x] Add Event - (https://voluntia.herokuapp.com/event/add)

  

5. Add event details and click on “add event” button.

6. You can also edit/delete event by clicking on post(edit) trash(delete) icon.

	 - [x] Edit - (https://voluntia.herokuapp.com/edit/event/:id)
	 - [x] Delete - (https://voluntia.herokuapp.com/delete/event/:id)

  

**List of files:**

  

- Routes: `/event/add, /edit/event/:id, /delete/event/:id`

- Views: `dashboardadmin.pug, event_form.pug, edit_event.pug`

- Controllers: `controller.js`
createEvent, getAddevent, getEditEvent, getEditEvent, deleteEvent

- Models: `event.js`