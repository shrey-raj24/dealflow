#!/usr/bin/env bash

# Exit on any error
set -e

# Determine current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)

START_DATE="2026-04-05"
END_DATE="2026-05-08"

current_date="$START_DATE"

while [[ "$current_date" < "$END_DATE" ]] || [[ "$current_date" == "$END_DATE" ]]; do
  echo "Processing date $current_date"
  for i in {1..5}; do
    # Set commit date environment variables for reproducible timestamps
    export GIT_AUTHOR_DATE="$current_date 09:00:00 +0000"
    export GIT_COMMITTER_DATE="$current_date 09:00:00 +0000"
    git commit --allow-empty -m "Empty commit $i for $current_date"
  done
  # Push after the day's commits
  git push origin "$BRANCH"
  # Move to next day
  current_date=$(date -j -v +1d -f "%Y-%m-%d" "$current_date" "+%Y-%m-%d")
done

echo "All commits created and pushed."
