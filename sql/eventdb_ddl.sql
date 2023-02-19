 CREATE TABLE ADMIN( email varchar(20),
                     First_name varchar(17),
                     Last_name varchar(17),
                     password varchar(17), 
                     primary key (email));
					 
 CREATE TABLE login_details ( email varchar(20),
                     First_name varchar(17),
                     Last_name varchar(17),
                     password varchar(17), 
					street varchar(20),
					city varchar(20),
					state varchar(20),
					country varchar(20),
                     primary key (email));
					 
CREATE TABLE event ( event_id varchar(20),
                     start_date timestamp,
					end_date TIMESTAMP,
					rating int check (rating<=5 and rating>=1),
					event_type varchar(20),
					description varchar(30),
					location varchar(20),
                     primary key (event_id));
					 

CREATE TABLE client ( client_id varchar(20),
					 booked_status bool,
					 primary key (client_id),
					 foreign key (client_id) references login_details
);

CREATE TABLE event_planner ( planner_id varchar(20),
							speciality varchar(20),
							organization_name varchar(20),
							primary key (planner_id),
						   foreign key (planner_id) references login_details);
							
CREATE TABLE vendor ( vendor_id varchar(20),
					 service_type varchar(20),
					 primary key (vendor_id,service_type),
					 foreign key (vendor_id) references login_details
);
					 
CREATE TABLE profile ( tagline varchar(20),
					  overall_rating int check (overall_rating<=5 and overall_rating>=1),
					  description varchar(30),
					  owner varchar(20),
					  primary key (owner),
					  foreign key (owner) references login_details);
					  
CREATE TABLE consists_of ( prof_id varchar(20),
						  event_id varchar(20),
						  primary key (prof_id, event_id),
					  foreign key (event_id) references event,
						  foreign key (prof_id) references profile
);

CREATE TABLE reports ( report_by varchar(20),
					  report_on varchar(20),
					  description varchar(30),
					  primary key(report_by, report_on),
					  foreign key (report_by) references login_details,
					  foreign key (report_on) references login_details
);

CREATE TABLE plans ( planner_id varchar(20),
						  event_id varchar(20),
						  primary key (planner_id, event_id),
					  foreign key (event_id) references event,
						  foreign key (planner_id) references event_planner
);

CREATE TABLE organizes ( client_id varchar(20),
						  event_id varchar(20),
						  primary key (client_id, event_id),
					  foreign key (event_id) references event,
						  foreign key (client_id) references client
);

CREATE TABLE has ( vendor_id varchar(20),
						  event_id varchar(20),
				  service_type varchar(20),
						  primary key (vendor_id, service_type, event_id),
					  foreign key (event_id) references event,
						  foreign key (vendor_id, service_type) references vendor (vendor_id, service_type)
);