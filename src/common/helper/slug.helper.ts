import {
  Model,
  ModelStatic,
  Op,
} from 'sequelize';

export class SlugHelper {
  /**
   * Generate a unique slug from a title
   * @param title - The title to convert to slug
   * @param model - The Sequelize model to check uniqueness against
   * @param slugField - The name of the slug field in the model (default: 'slug')
   * @param excludeId - Optional ID to exclude from uniqueness check (for updates)
   * @returns An object with the unique slug and 5 suggested alternatives
   */
  static async generateUniqueSlug<
    T extends Model,
  >(
    title: string,
    model: ModelStatic<T>,
    slugField: string = 'slug',
    excludeId?: number,
  ): Promise<{
    slug: string;
    isUnique: boolean;
    suggestions: string[];
  }> {
    // Generate base slug from title
    const baseSlug = this.createSlug(title);

    // Check if base slug is unique
    const whereClause: any = {
      [slugField]: baseSlug,
    };
    if (excludeId) {
      whereClause.id = { [Op.ne]: excludeId };
    }

    const existingRecord = await model.findOne({
      where: whereClause,
    });

    // If slug is unique, return it with suggestions
    if (!existingRecord) {
      return {
        slug: baseSlug,
        isUnique: true,
        suggestions:
          await this.generateSlugSuggestions(
            baseSlug,
            model,
            slugField,
            excludeId,
          ),
      };
    }

    // If not unique, find a unique variant
    const uniqueSlug = await this.findUniqueSlug(
      baseSlug,
      model,
      slugField,
      excludeId,
    );

    // Generate suggestions including the unique slug
    const suggestions =
      await this.generateSlugSuggestions(
        baseSlug,
        model,
        slugField,
        excludeId,
        uniqueSlug,
      );

    return {
      slug: uniqueSlug,
      isUnique: false,
      suggestions,
    };
  }

  /**
   * Convert a title to a URL-friendly slug
   * @param title - The title to convert
   * @returns The generated slug
   */
  static createSlug(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .normalize('NFD') // Normalize unicode characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  /**
   * Find a unique slug by appending numbers
   * @param baseSlug - The base slug to make unique
   * @param model - The Sequelize model
   * @param slugField - The slug field name
   * @param excludeId - Optional ID to exclude
   * @returns A unique slug
   */
  private static async findUniqueSlug<
    T extends Model,
  >(
    baseSlug: string,
    model: ModelStatic<T>,
    slugField: string,
    excludeId?: number,
  ): Promise<string> {
    let counter = 1;
    let uniqueSlug = `${baseSlug}-${counter}`;

    while (true) {
      const whereClause: any = {
        [slugField]: uniqueSlug,
      };
      if (excludeId) {
        whereClause.id = { [Op.ne]: excludeId };
      }

      const exists = await model.findOne({
        where: whereClause,
      });

      if (!exists) {
        return uniqueSlug;
      }

      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;

      // Safety limit to prevent infinite loops
      if (counter > 1000) {
        // Append timestamp as fallback
        return `${baseSlug}-${Date.now()}`;
      }
    }
  }

  /**
   * Generate 5 unique slug suggestions
   * @param baseSlug - The base slug
   * @param model - The Sequelize model
   * @param slugField - The slug field name
   * @param excludeId - Optional ID to exclude
   * @param includeSlug - Optional slug to include in suggestions
   * @returns Array of 5 unique slug suggestions
   */
  private static async generateSlugSuggestions<
    T extends Model,
  >(
    baseSlug: string,
    model: ModelStatic<T>,
    slugField: string,
    excludeId?: number,
    includeSlug?: string,
  ): Promise<string[]> {
    const suggestions: string[] = [];
    const timestamp = Date.now();
    const randomSuffix = Math.random()
      .toString(36)
      .substring(2, 6);

    // Suggestion patterns
    const patterns = [
      includeSlug || baseSlug, // The actual unique slug (if provided)
      `${baseSlug}-${timestamp}`, // With timestamp
      `${baseSlug}-${randomSuffix}`, // With random string
      `${baseSlug}-new`, // With 'new' suffix
      `${baseSlug}-v2`, // With version number
      `${baseSlug}-latest`, // With 'latest' suffix
      `${baseSlug}-${new Date().getFullYear()}`, // With current year
    ];

    // Check each pattern for uniqueness
    for (const pattern of patterns) {
      if (suggestions.length >= 5) break;

      const whereClause: any = {
        [slugField]: pattern,
      };
      if (excludeId) {
        whereClause.id = { [Op.ne]: excludeId };
      }

      const exists = await model.findOne({
        where: whereClause,
      });

      if (
        !exists &&
        !suggestions.includes(pattern)
      ) {
        suggestions.push(pattern);
      }
    }

    // If we don't have 5 suggestions yet, add numbered variants
    let counter = 1;
    while (suggestions.length < 5) {
      const numberedSlug = `${baseSlug}-${counter}`;

      const whereClause: any = {
        [slugField]: numberedSlug,
      };
      if (excludeId) {
        whereClause.id = { [Op.ne]: excludeId };
      }

      const exists = await model.findOne({
        where: whereClause,
      });

      if (
        !exists &&
        !suggestions.includes(numberedSlug)
      ) {
        suggestions.push(numberedSlug);
      }

      counter++;

      // Safety limit
      if (counter > 100) break;
    }

    return suggestions.slice(0, 5);
  }

  /**
   * Validate if a slug is unique in the database
   * @param slug - The slug to validate
   * @param model - The Sequelize model
   * @param slugField - The slug field name
   * @param excludeId - Optional ID to exclude from check
   * @returns True if slug is unique, false otherwise
   */
  static async isSlugUnique<T extends Model>(
    slug: string,
    model: ModelStatic<T>,
    slugField: string = 'slug',
    excludeId?: number,
  ): Promise<boolean> {
    const whereClause: any = {
      [slugField]: slug,
    };
    if (excludeId) {
      whereClause.id = { [Op.ne]: excludeId };
    }

    const existingRecord = await model.findOne({
      where: whereClause,
    });
    return !existingRecord;
  }
}
