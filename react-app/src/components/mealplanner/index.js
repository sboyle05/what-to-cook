import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import './mealplanner.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMealPlanner } from '../../store/mealPlanner';
import { fetchSingleRecipe } from '../../store/recipe';
import UpdateMealPlannerModal from '../updateMealPlannerModal';

const MealPlanner = () => {
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedMealPlanner, setSelectedMealPlanner] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const meals = useSelector(state => state.mealPlanner.mealPlanner);

  let userName, userId;

  if (sessionUser) {
    userId = sessionUser.id;
}

  const refetchMealPlanner = () => {
    dispatch(fetchMealPlanner());
  }

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
          const mealDate = new Date(meal.date);
          const year = mealDate.getUTCFullYear();
          const month = mealDate.getUTCMonth();
          const day = mealDate.getUTCDate();
          const utcDate = new Date(Date.UTC(year, month, day));
          newCalendarEvents.push({
            id: meal.id.toString(),
            title: recipe.name || 'Unknown',
            start: utcDate,
            allDay: true,
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

  const handleEventClick = (info) => {
    // flatten arrays into single array
    const flattenedMeals = meals.flat();
    const clickedMealPlanner = flattenedMeals.find(meal => meal.id === Number(info.event.id));
    setSelectedMealPlanner(clickedMealPlanner);
    setShowModal(true);
  };

  useEffect(() => {
  }, [selectedMealPlanner]);

  const closeModal = () => {
    setShowModal(false);
    setSelectedMealPlanner(null);
  };

  return (
    <>
      {showModal && (
        <section className='modalPlanner'>
        <UpdateMealPlannerModal mealPlanner={selectedMealPlanner} userId={userId} refetch={refetchMealPlanner} onClose={closeModal} />
        </section>
      )}
      <section className="mainCalendarContainer">
        <FullCalendar
          timeZone='PST'
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
          initialView="dayGridMonth"
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listWeek'
          }}
          events={calendarEvents}
        />
      </section>
    </>
  );
};

export default MealPlanner;
