    import React, { useEffect, useState } from 'react';
    import FullCalendar from '@fullcalendar/react';
    import dayGridPlugin from '@fullcalendar/daygrid';
    import timeGridPlugin from '@fullcalendar/timegrid';
    import listPlugin from '@fullcalendar/list';
    import './mealplanner.css';
    import { useDispatch, useSelector } from 'react-redux';
    import { fetchMealPlanner, editMealPlanner, deleteMealPlanner } from '../../store/mealPlanner';
    import { fetchSingleRecipe } from '../../store/recipe';

    const MealPlanner = () => {
    const [calendarEvents, setCalendarEvents] = useState([]);
    const dispatch = useDispatch();
    const meals = useSelector(state => state.mealPlanner.mealPlanner);

    useEffect(() => {
        dispatch(fetchMealPlanner());
    }, [dispatch]);

    useEffect(() => {
        const fetchRecipeNames = async () => {
        const newCalendarEvents = [];
        const flattenedMeals = meals.flat();

        for (let meal of flattenedMeals) {
            const action = await dispatch(fetchSingleRecipe(meal.recipe_id));
            const recipe = action;

            if (recipe) {
            newCalendarEvents.push({
                id: recipe.id.toString(),
                title: recipe.name || 'Unknown',
                start: new Date(meal.date),
                allDay: true, //if i dont set this defaults to 5pm
                color: getColorForMealType(meal.meal_type),
            });
            }
        }

        setCalendarEvents(newCalendarEvents);
        };

        fetchRecipeNames();
    }, [meals, dispatch]);

    const getColorForMealType = (mealType) => {
        const colors = {
        'breakfast': 'red',
        'lunch': 'blue',
        'dinner': 'green',
        'brunch': 'purple',
        'snack': '#6200ea',
        'dessert': 'brown'
        };

        return colors[mealType] || 'gray';
    };

    const handleEventClick = ({ event }) => {

        const userAction = window.prompt("Do you want to update or delete this event? (Type 'update' or 'delete')");

        if (userAction === 'update') {
           //Update
            const newDate = window.prompt("Enter the new date (YYYY-MM-DD)");
            if (newDate) {
                // Update event date on calendar UI
                event.setDates(newDate);
                dispatch(editMealPlanner(event.id, { date: newDate }));
            }
        } else if (userAction === 'delete') {
            event.remove();
            dispatch(deleteMealPlanner(event.id));
        }
    };

    return (
        <div className="mainCalendarContainer">
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
            initialView="dayGridMonth"
            eventClick={handleEventClick}
            headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
            }}
            events={calendarEvents}/>
        </div>
    );
    };

    export default MealPlanner;
