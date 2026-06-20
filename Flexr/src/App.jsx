import { useState } from 'react'
import Header from './components/Header'
import PointsModal from './components/PointsModal'
import StreakModal from './components/StreakModal'
import ActivitiesPage from './pages/ActivitiesPage'
import ShopPage from './pages/ShopPage'
import ReportsPage from './pages/ReportsPage'
import GeneralWorkoutPreviewPage from './features/workout/GeneralWorkoutPreviewPage'
import WorkoutSessionPage from './features/workout/WorkoutSessionPage'
import PullupsSessionPage from './features/pullups/PullupsSessionPage'
import HooverSessionPage from './features/hoover/HooverSessionPage'
import { activities } from './data/activities'
import { calculateActivityPoints } from './utils/points'
import { createHistoryEntry } from './utils/history'
import { loadState, saveState } from './utils/storage'
import {
  addDailyActivityProgress,
  areAllActivitiesDoneForStreak,
  applyActivityResultToStreak,
  freezeDailyStreakProgress,
  hasMissedStreakWindow,
  isActivityDoneForStreak,
  isStreakFrozenForDate,
} from './utils/streak'
import './App.css'

const getInitialAppState = () => {
  const savedState = loadState()

  if (hasMissedStreakWindow(savedState)) {
    return {
      showStreakLostBanner: true,
      userState: saveState({
        ...savedState,
        streak: 0,
        lastActivityDate: null,
      }),
    }
  }

  return {
    showStreakLostBanner: false,
    userState: savedState,
  }
}

const createWorkoutDetails = (workoutConfig) => {
  const setsText = `${workoutConfig.sets} Sets`;
  const exerciseText = workoutConfig.exercises
    .map((exercise) => `${exercise.reps}x ${exercise.name}`)
    .join(", ");

  return `${setsText}: ${exerciseText}`;
};

const isWorkoutModified = (activity, workoutConfig) => {
  if (workoutConfig.sets !== activity.defaultSets) {
    return true;
  }

  return workoutConfig.exercises.some(
    (exercise) => exercise.reps !== exercise.defaultReps,
  );
};

function App() {
  const [initialAppState] = useState(getInitialAppState)
  const [activeTab, setActiveTab] = useState('Activities')
  const [activeActivityId, setActiveActivityId] = useState(null)
  const [workoutConfig, setWorkoutConfig] = useState(null)
  const [pullupsActivity, setPullupsActivity] = useState(null)
  const [hooverActivity, setHooverActivity] = useState(null)
  const [message, setMessage] = useState('')
  const [userState, setUserState] = useState(initialAppState.userState)
  const [isSessionComplete, setIsSessionComplete] = useState(false)
  const [isPointsModalOpen, setIsPointsModalOpen] = useState(false)
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false)
  const [showStreakLostBanner, setShowStreakLostBanner] = useState(
    initialAppState.showStreakLostBanner,
  )
  const currentDate = new Date()
  const isDailyStreakComplete = areAllActivitiesDoneForStreak(
    activities,
    userState,
    currentDate,
  )
  const isDailyStreakFrozen = isStreakFrozenForDate(userState, currentDate)
  const streakDoneActivityIds = activities
    .filter((activity) =>
      isActivityDoneForStreak(activity, userState, currentDate),
    )
    .map((activity) => activity.id)

  const calculateAwardedActivityPoints = (
    activity,
    basePoints,
    completedAmount = 1,
  ) => {
    if (!activity) {
      return basePoints
    }

    const progressState = {
      ...userState,
      dailyStreakProgress: addDailyActivityProgress(
        userState,
        activity.id,
        completedAmount,
        currentDate,
      ),
    }
    const qualifiesForStreakBonus = areAllActivitiesDoneForStreak(
      activities,
      progressState,
      currentDate,
    )

    return calculateActivityPoints(
      basePoints,
      qualifiesForStreakBonus ? userState.streak : 0,
    )
  }

  const handleOpenActivity = (activity) => {
    console.log(`Open activity: ${activity.id}`)

    if (activity.id === 'general-workout') {
      setActiveActivityId(activity.id)
      setIsSessionComplete(false)
      setMessage('')
      return
    }

    if (activity.id === 'pull-ups') {
      setPullupsActivity(activity)
      setActiveActivityId(null)
      setIsSessionComplete(false)
      setMessage('')
      return
    }

    if (activity.id === 'hoover-the-house') {
      setHooverActivity(activity)
      setActiveActivityId(null)
      setIsSessionComplete(false)
      setMessage('')
      return
    }

    setActiveActivityId(null)
    setMessage(`${activity.name} preview coming soon.`)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setActiveActivityId(null)
    setWorkoutConfig(null)
    setPullupsActivity(null)
    setHooverActivity(null)
    setIsSessionComplete(false)
    setMessage('')
  }

  const handleStartWorkout = (configuredWorkout) => {
    setWorkoutConfig(configuredWorkout)
    setIsSessionComplete(false)
  }

  const handleEndEarly = () => {
    setActiveTab('Activities')
    setActiveActivityId(null)
    setWorkoutConfig(null)
    setPullupsActivity(null)
    setHooverActivity(null)
    setIsSessionComplete(false)
    setMessage('')
  }

  const handleWorkoutComplete = ({ activity, workoutConfig }) => {
    setUserState((currentState) => {
      const activityDate = new Date()
      const progressState = {
        ...currentState,
        dailyStreakProgress: addDailyActivityProgress(
          currentState,
          activity.id,
          1,
          activityDate,
        ),
      }
      const hasMetDailyStreakMinimum = areAllActivitiesDoneForStreak(
        activities,
        progressState,
        activityDate,
      )
      const awardedPoints = calculateActivityPoints(
        activity.points,
        hasMetDailyStreakMinimum ? currentState.streak : 0,
      )
      const streakState = hasMetDailyStreakMinimum
        ? applyActivityResultToStreak(progressState, true, activityDate)
        : progressState
      const balanceAfter = currentState.points + awardedPoints
      const historyEntry = createHistoryEntry({
        type: 'activity',
        item: activity.name,
        pointsChange: awardedPoints,
        streakAfter: streakState.streak,
        balanceAfter,
        details: createWorkoutDetails(workoutConfig),
        isModified: isWorkoutModified(activity, workoutConfig),
        timestamp: activityDate.toISOString(),
      })
      const nextState = {
        ...streakState,
        points: balanceAfter,
        history: [...currentState.history, historyEntry],
      }

      return saveState(nextState)
    })

    setActiveTab('Activities')
    setActiveActivityId(null)
    setWorkoutConfig(null)
    setPullupsActivity(null)
    setIsSessionComplete(false)
    setMessage('')
  }

  const handlePullupsComplete = ({ activity, pullupCount }) => {
    setUserState((currentState) => {
      const activityDate = new Date()
      const progressState = {
        ...currentState,
        dailyStreakProgress: addDailyActivityProgress(
          currentState,
          activity.id,
          pullupCount,
          activityDate,
        ),
      }
      const hasMetDailyStreakMinimum = areAllActivitiesDoneForStreak(
        activities,
        progressState,
        activityDate,
      )
      const streakState = hasMetDailyStreakMinimum
        ? applyActivityResultToStreak(progressState, true, activityDate)
        : progressState
      const awardedPoints = calculateActivityPoints(
        pullupCount * activity.points,
        hasMetDailyStreakMinimum ? currentState.streak : 0,
      )
      const balanceAfter = currentState.points + awardedPoints
      const historyEntry = createHistoryEntry({
        type: 'activity',
        item: activity.name,
        pointsChange: awardedPoints,
        streakAfter: streakState.streak,
        balanceAfter,
        details: `${pullupCount} Pull-ups x ${activity.points} points`,
        isModified: false,
        timestamp: activityDate.toISOString(),
      })
      const nextState = {
        ...streakState,
        points: balanceAfter,
        history: [...currentState.history, historyEntry],
      }

      return saveState(nextState)
    })

    setActiveTab('Activities')
    setActiveActivityId(null)
    setWorkoutConfig(null)
    setPullupsActivity(null)
    setIsSessionComplete(false)
    setMessage('')
  }

  const handleHooverComplete = ({ activity }) => {
    setUserState((currentState) => {
      const activityDate = new Date()
      const progressState = {
        ...currentState,
        dailyStreakProgress: addDailyActivityProgress(
          currentState,
          activity.id,
          1,
          activityDate,
        ),
      }
      const hasMetDailyStreakMinimum = areAllActivitiesDoneForStreak(
        activities,
        progressState,
        activityDate,
      )
      const awardedPoints = calculateActivityPoints(
        activity.points,
        hasMetDailyStreakMinimum ? currentState.streak : 0,
      )
      const balanceAfter = currentState.points + awardedPoints
      const historyEntry = createHistoryEntry({
        type: 'activity',
        item: activity.name,
        pointsChange: awardedPoints,
        streakAfter: currentState.streak,
        balanceAfter,
        details: '1 Activity',
        isModified: false,
        timestamp: activityDate.toISOString(),
      })
      const nextState = {
        ...progressState,
        points: balanceAfter,
        history: [...currentState.history, historyEntry],
      }

      return saveState(nextState)
    })

    setActiveTab('Activities')
    setActiveActivityId(null)
    setWorkoutConfig(null)
    setPullupsActivity(null)
    setHooverActivity(null)
    setIsSessionComplete(false)
    setMessage('')
  }

  const handleRedeemReward = (reward) => {
    setUserState((currentState) => {
      if (currentState.points < reward.cost) {
        return currentState
      }

      const rewardDate = new Date()
      const isRestDayReward = reward.id === 'rest-day-keep-streak'
      const balanceAfter = currentState.points - reward.cost
      const rewardState = isRestDayReward
        ? {
            ...currentState,
            dailyStreakProgress: freezeDailyStreakProgress(
              currentState,
              rewardDate,
            ),
            lastActivityDate: rewardDate.toISOString(),
          }
        : currentState
      const historyEntry = createHistoryEntry({
        type: 'reward',
        item: reward.title,
        pointsChange: -reward.cost,
        streakAfter: rewardState.streak,
        balanceAfter,
        details: '-',
        isModified: false,
        timestamp: rewardDate.toISOString(),
      })
      const nextState = {
        ...rewardState,
        points: balanceAfter,
        history: [...rewardState.history, historyEntry],
      }

      return saveState(nextState)
    })
  }

  const handleUpdatePoints = (nextPoints) => {
    const safePoints = Number.isFinite(nextPoints) && nextPoints >= 0
      ? Math.floor(nextPoints)
      : userState.points

    setUserState((currentState) =>
      saveState({
        ...currentState,
        points: safePoints,
      }),
    )
    setIsPointsModalOpen(false)
  }

  const handleUpdateStreak = (nextStreak) => {
    const safeStreak = Number.isFinite(nextStreak) && nextStreak >= 0
      ? Math.floor(nextStreak)
      : userState.streak

    setUserState((currentState) =>
      saveState({
        ...currentState,
        streak: safeStreak,
        lastActivityDate: new Date().toISOString(),
      }),
    )
    setIsStreakModalOpen(false)
  }

  const renderTabContent = () => {
    if (workoutConfig) {
      return (
        <WorkoutSessionPage
          awardedPoints={calculateAwardedActivityPoints(
            activities.find(
              (activity) => activity.id === workoutConfig.activityId,
            ),
            workoutConfig.activityPoints,
          )}
          onWorkoutComplete={handleWorkoutComplete}
          onSessionComplete={() => setIsSessionComplete(true)}
          workoutConfig={workoutConfig}
        />
      )
    }

    if (pullupsActivity) {
      return (
        <PullupsSessionPage
          activity={pullupsActivity}
          awardedPoints={(basePoints, pullupCount) =>
            calculateAwardedActivityPoints(
              pullupsActivity,
              basePoints,
              pullupCount,
            )
          }
          onComplete={handlePullupsComplete}
          onSessionComplete={() => setIsSessionComplete(true)}
        />
      )
    }

    if (hooverActivity) {
      return (
        <HooverSessionPage
          activity={hooverActivity}
          onComplete={handleHooverComplete}
          onSessionComplete={() => setIsSessionComplete(true)}
        />
      )
    }

    if (activeTab === 'Activities') {
      if (activeActivityId === 'general-workout') {
        return <GeneralWorkoutPreviewPage onStartWorkout={handleStartWorkout} />
      }

      return (
        <>
          <ActivitiesPage
            onDismissStreakLost={() => setShowStreakLostBanner(false)}
            onOpenActivity={handleOpenActivity}
            showStreakLostBanner={showStreakLostBanner}
            streakDoneActivityIds={streakDoneActivityIds}
          />
          {message && <p className="placeholder-message">{message}</p>}
        </>
      )
    }

    if (activeTab === 'Shop') {
      return (
        <ShopPage
          isDailyStreakComplete={isDailyStreakComplete}
          isDailyStreakFrozen={isDailyStreakFrozen}
          onRedeemReward={handleRedeemReward}
          points={userState.points}
        />
      )
    }

    if (activeTab === 'Reports') {
      return <ReportsPage history={userState.history} />
    }

    return (
      <section className="placeholder-panel">
        <h1>{activeTab}</h1>
        <p>{activeTab} will be built next.</p>
      </section>
    )
  }

  return (
    <div className="app-shell">
      <Header
        activeTab={activeTab}
        isSessionMode={Boolean(workoutConfig || pullupsActivity || hooverActivity) && !isSessionComplete}
        onEndEarly={handleEndEarly}
        onLogoClick={() => handleTabChange('Activities')}
        onPointsClick={() => setIsPointsModalOpen(true)}
        onStreakClick={() => setIsStreakModalOpen(true)}
        onTabChange={handleTabChange}
        isDailyStreakComplete={isDailyStreakComplete}
        isDailyStreakFrozen={isDailyStreakFrozen}
        points={userState.points}
        streak={userState.streak}
      />
      <main className="page-container">{renderTabContent()}</main>
      {isPointsModalOpen && (
        <PointsModal
          onClose={() => setIsPointsModalOpen(false)}
          onUpdatePoints={handleUpdatePoints}
          points={userState.points}
        />
      )}
      {isStreakModalOpen && (
        <StreakModal
          onClose={() => setIsStreakModalOpen(false)}
          onUpdateStreak={handleUpdateStreak}
          streak={userState.streak}
        />
      )}
    </div>
  )
}

export default App
